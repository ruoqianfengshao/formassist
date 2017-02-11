process.settings = {
  paths: {
    app: "app",
    test: "test",
    vendor: "vendor",
    public: "public"
  },
  bases: [
    "app/scripts/{*,}",
    "app/images",
    "app/views",
    "./",
  ],
  bundles: [
    {
      name: "randexp.js",
      version: "0.4.4",
      url: "https://raw.githubusercontent.com/fent/randexp.js/master/build/randexp.min.js"
    },{
      name: "jquery.js",
      version: "3.1.1",
      url: "http://cdn.bootcss.com/jquery/3.1.1/jquery.js"
    },
  ],
  scriptsOrder: [
    "vendor/require.js",
    "vendor/jquery.js",
    "vendor/randexp.js",
    "...",
    "app/scripts/app.es"
  ],
}

module.exports = (shepherd) => {
  const log = shepherd.log
  const { babel, concat, compass, cmd, uglifier, rev, copy } = shepherd.chains
  const { repo } = shepherd.plugins

  const scripts = (src, dest) => {
    return shepherd.src(src)
      .then(babel({
        perferSyntax: [".es"],
        compileOptions: {
          presets: ["es2015"],
          plugins: ["add-module-exports", "transform-es3-property-literals", "transform-es3-member-expression-literals"]} }))
      // .then(cmd())
      .then(concat(dest, { order: process.settings.scriptsOrder }))
      .then(uglifier())
      .then(shepherd.dest())
  }

  shepherd.task("repo", () => {
    return repo({ bundles: process.settings.bundles })
  })

  shepherd.task("scripts", () => {
    return shepherd.src("app/scripts/app.es")
      .then(babel({
        perferSyntax: [".es"],
        compileOptions: {
          presets: ["es2015"],
          plugins: ["add-module-exports", "transform-es3-property-literals", "transform-es3-member-expression-literals"]} }))
      // .then(cmd())
      .then(concat("public/app.js", { order: process.settings.scriptsOrder }))
      .then(uglifier())
      .then(shepherd.dest())
  })

  shepherd.task("scripts", () => {
    return scripts("app/scripts/app.es", "public/app.js")
  })

  shepherd.task("backgroundScripts", () => {
    return scripts("app/scripts/background/*.es", "public/background.js")
  })

  shepherd.task("embedScripts", () => {
    return scripts("{app/scripts/content,vendor}/**/*.{es,js}", "public/embed.js")
  })

  shepherd.task("styles", () => {
    return shepherd.src("app/styles/**/*.scss")
      .then(compass())
      .then(concat("public/app.css"))
      .then(shepherd.dest())
  })

  shepherd.task("images", () => {
    return shepherd.src("app/images/*.png")
      .then(copy("public/images"))
      .then(shepherd.dest())
  })

  shepherd.task("view", () => {
    return shepherd.src("app/views/*.html")
      .then(copy("public/"))
      .then(shepherd.dest())
  })

  shepherd.task("file", () => {
    return shepherd.src("manifest.json")
      .then(copy("public/"))
      .then(shepherd.dest())
  })

  shepherd.task("watch", ["repo"], () => {
    shepherd.watch("{app,vendor}/**/*.{es,js}", ["backgroundScripts", "embedScripts", "scripts"])
    shepherd.watch("app/images/*.png", "images")
    shepherd.watch("app/styles/**/*.scss", "styles")
    shepherd.watch("app/views/*.html", "view")
    shepherd.watch("manifest.json", "file")
  })

  shepherd.task("revision", ["embedScripts", "scripts"], () => {
    return shepherd.src("public/**/*")
      .then(rev({
        rootPath: `${process.cwd()}/public`,
        manifest: "static-manifest.json"
      }))
      .then(copy("public/", { bases: ["public/"] }))
      .then(shepherd.dest())
  })

  shepherd.task("default", ["watch"])

  shepherd.task("build", ["repo"], () => {
    process.env.NODE_ENV = "production"
    return shepherd.run("revision")
  })
}

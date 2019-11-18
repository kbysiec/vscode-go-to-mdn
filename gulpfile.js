const gulp = require("gulp");
const replace = require("gulp-replace");

function fixCoverageReportSrcPaths() {
  return gulp
    .src("./dist/coverage/coverage-final.json")
    .pipe(
      replace(
        `"path":"Users/kamilbysiec/Local Repository/DEVELOPMENT/javascript/vscode-go-to-mdn/`,
        `"path":"`
      )
    )
    .pipe(gulp.dest("./dist/coverage"));
}

gulp.task("fixCoverageReportSrcPaths", fixCoverageReportSrcPaths);

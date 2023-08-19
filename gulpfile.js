const gulp = require('gulp');

gulp.task('increment-version', function(){

    // Import JSON Data
    var data = JSON.parse(fs.readFileSync('./data/guide.json', 'utf8'));

    // Parse JSON Version
    const versionCurrent = data.version;
    const versionSegments = versionCurrent.split('.');

    let versionArray = {
        versionMajor : versionSegments[0],
        versionMinor : versionSegments[1],
        versionPatch : versionSegments[2]
    };

    // Update JSON Version
    versionArray.versionPatch = parseFloat(versionArray.versionPatch) + 1;
    data.version = `${versionArray.versionMajor}.${versionArray.versionMinor}.${versionArray.versionPatch}`;

    // Export JSON Data
    fs.writeFileSync('./data/guide.json', JSON.stringify(data, null, 4));
});

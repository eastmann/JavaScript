/*
 * Gulp configuration
 */

'use strict'

// console.log('=============================')
// console.log('=== process.env:', process.env)
// console.log('=============================')

import gulp from 'gulp'

// Gulp plugins
import changed    from 'gulp-changed'
import plumber    from 'gulp-plumber'
import notifier   from 'gulp-notifier'

// other plugins
import del from 'del'
// import webpack from 'webpack-stream'
import { create as bsCreate } from 'browser-sync'

// Get Gulp methods
const { dest, series, parallel } = gulp
const bs = bsCreate()

/*
 * Set paths
 */

const DIRS = {
    ROOT : './',
    SRC  : './src',
    DIST : './dist'
}

const PATH = {
    HTML: {
        SRC  : `${DIRS.SRC}/**/*.html`,
        DIST : `${DIRS.DIST}/`
    },

    CSS: {
        SRC  : `${DIRS.SRC}/css/**/*.css`,
        DIST : `${DIRS.DIST}/css/`
    },

    IMAGES: {
        SRC  : `${DIRS.SRC}/images/**/*`,
        DIST : `${DIRS.DIST}/images/`
    },

    JS: {
        SRC  : `${DIRS.SRC}/js/**/*.js`,
        DIST : `${DIRS.DIST}/js/`
    }
}

/*
 * Set plugin's configurations
 */

const CONFIG = {
    SERVER: {
        port: 3333,
        server: {
            baseDir: DIRS.DIST,
            index : 'index.html'
        },
        open: false,
        notify: false
    },

    PLUMBER: {
        errorHandler: notifier.error
    }
}

/**
 * Gulp tasks
 */

export const css = () => {
    return gulp
        .src([PATH.CSS.SRC])
        .pipe(dest(PATH.CSS.DIST))
}

export const styles = parallel(css)

export const image_min = () => {
    return gulp
        .src(PATH.IMAGES.SRC)
        .pipe(changed(PATH.IMAGES.DIST))
        .pipe(dest(PATH.IMAGES.DIST))
}

export const images = parallel(image_min)

export const js = () => {
    return gulp
        .src(PATH.JS.SRC)
        .pipe(changed(PATH.JS.DIST))
        .pipe(dest(PATH.JS.DIST))
}

export const html = () => {
    return gulp
        .src(PATH.HTML.SRC)
        .pipe(changed(PATH.HTML.DIST))
        .pipe(plumber(CONFIG.PLUMBER))
        .pipe(dest(PATH.HTML.DIST))
}

export const clean = () => {
    return del(`${DIRS.DIST}/*`);
}

/*
 * Build and watch tasks
 */

export const build = parallel(
    js,
    html,
    styles,
    images
)

export const watch = () => {
    bs.init(CONFIG.SERVER)

    gulp.watch([PATH.HTML.SRC], html)
        .on('change', bs.reload)

    gulp.watch([PATH.CSS.SRC], styles)
        .on('change', bs.reload)

    gulp.watch([PATH.IMAGES.SRC], images)
        .on('change', bs.reload)

    gulp.watch([PATH.JS.SRC], js)
        .on('change', bs.reload)
}

export default series(build, watch)

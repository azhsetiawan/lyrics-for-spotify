// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

"use strict";

var SpotifyWebHelper = require('@jonny/spotify-web-helper')
var helper = SpotifyWebHelper()

var currentArtist = 'Artist'
var currentSong = 'Song'

var request = require('request')
var cheerio = require('cheerio')

var urlBase = 'http://www.azlyrics.com/'
var urlLyric = 'http://www.azlyrics.com/lyrics/'
var notFound = 'Error: Not found.'

function cleanArtist(artist) {
    return artist.toLowerCase().replace(/^(the )/g, '').replace(/[^\w\d]/g, '')
}

function cleanSong(song) {
    var titleA = /([a-z0-9&\s',.]+[a-z0-9&',.]).*/i.exec(song)
    return titleA[1].toLowerCase().replace(/\s/g, '').replace(/[^a-z0-9]/g, '')
}

function changeTrackInfo(artist, song) {
    document.getElementById('artist').innerHTML = artist
    document.getElementById('song').innerHTML = song

    // console.info( cleanArtist(artist) )
    // console.info( cleanSong(song) )
}

function getLyric(artist, song) {
    var urlArtist = cleanArtist(artist)
    var urlSong = cleanSong(song)

    var url = `${urlLyric}${urlArtist}/${urlSong}.html`;

    // console.info(url);

    request(url, function(error, response, html){
        if(error){
            reject(error)
        }else{
            // console.log('lyric found')

            var $ = cheerio.load(html)

            var lyrics = ''

            $('.ringtone').filter(function() {
                lyrics = $(this).nextAll('div').html()
            })

            // console.info(lyrics)
            document.getElementById('lyric').innerHTML = lyrics

        }
    })

}

 
helper.player.on('ready', function() {

    helper.player.on('track-change', function(track) {
        // console.info(track.artist_resource.name, '-', track.track_resource.name)

        currentArtist = track.artist_resource.name
        currentSong = track.track_resource.name

        changeTrackInfo(currentArtist, currentSong)
        document.getElementById('lyric').innerHTML = '...'
        getLyric(currentArtist, currentSong)
    })
 
    helper.player.on('error', function(err) {})
 
    // console.log(helper.status.track.artist_resource.name, '-', helper.status.track.track_resource.name)

    currentArtist = helper.status.track.artist_resource.name
    currentSong = helper.status.track.track_resource.name

    changeTrackInfo(currentArtist, currentSong)
    getLyric(currentArtist, currentSong)

});
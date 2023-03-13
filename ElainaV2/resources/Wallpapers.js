import data from '../configs/ElainaV2_config.json'
let default_settings = data

function Wallpapers() {
    const video = document.createElement('video');
	video.id = 'elaina-bg';
	video.autoplay = true;
	video.loop = true;
	video.src = default_settings["default_wallpaper_src"];
	video.volume = default_settings["video_sound_volume"];

    document.querySelector("body").prepend(video)
}

let WallpaperExport = {
    Wallpapers: Wallpapers
}

export default WallpaperExport
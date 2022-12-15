var elem = document.getElementById("divPDF"); function fullscreen() {
    var isInFullScreen = (document.fullscreenElement && document.fullscreenElement !== null) ||
        (document.webkitFullscreenElement && document.webkitFullscreenElement !== null) ||
        (document.mozFullScreenElement && document.mozFullScreenElement !== null) ||
        (document.msFullscreenElement && document.msFullscreenElement !== null);

    if (!isInFullScreen) {
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.mozRequestFullScreen) {
            elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullScreen) {
            elem.webkitRequestFullScreen();
        } else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }
}
// Previsualizacion de PDF
var options = {
    pdfOpenParams: { view: 'Fit', scrollbar: '1', toolbar: '1', statusbar: '1', messages: '1', navpanes: '1', highlight: '0,0,0,0' }
};


$("input[type=file]").change(function (event) {
    PDFObject.embed(URL.createObjectURL(event.target.files[0]), "#divPDF", options);
    console.log(event.target.files[0]);
    
});
/* Close when someone clicks on the overlay */



function triggerNav() {

        if(document.getElementById("tableOverlay").offsetWidth > 512) {
            closeNav()
        }
        else{
            openNav()
        }
}

function closeNav() {
    //1280
    document.getElementById("tableOverlay").style.width = "40%";
    document.getElementById("map").style.marginLeft = "38%"
}

function openNav() {
    //512
    document.getElementById("tableOverlay").style.width = "100%";
}







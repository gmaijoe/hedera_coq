/**
 * Created by gmaister on 3/9/15.
 */
function Search(searchID, resultBox) {
    var search = document.getElementById(searchID);
    var xhr = new XMLHttpRequest();

    search.onkeyup = function (event) {
        this.searchterm = search.value.toLowerCase();

        xhr.onreadystatechange = function () {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    var photojson = JSON.parse(this.responseText);
                    console.log(this.responseText);
                    var photohtml = "JSON response:"
                    for (var i = 0; i < photojson.length; i++) {
                        photohtml += "<div>" + "<a href='/photos/index/" + photojson[i]["user_id"] + "#" + photojson[i]["id"] + "'>" +
                        "<img src=/assets/" + photojson[i]["file_name"] + " style='width:128px;height:128px'>" + "</a>" + "</div>"
                    }
                    document.getElementById(resultBox).innerHTML = photohtml;
                } else {
                    return; // Handle error
                }
            }
        }
        xhr.open("GET", "/photos/search?substring=" + this.searchterm);
        xhr.send();
    }
}


alert(5);
$(function () {
    $('#exampleModal').on('shown.bs.modal', function () {
        $('#myInput').trigger('focus')
    })

    $('#exampleModal #buttonSubmit').on("click", function () {

        $.get("/encode", { text: $("#myString").val() }).done(function (result) {
            console.log(result.url);
            $("#results").append(`<div class="row">
            <div class="col-sm">
                ${$("#myString").val()}
            </div>
            <div class="col-sm">
                <img src='${result.url}'>
            </div>
        </div>`)
        }).always(function () {
            $('#exampleModal').modal('hide');
        });

        
    });

});
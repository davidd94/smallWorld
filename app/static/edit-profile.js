$("#submit-profile-cancel-btn").click(function() {

    //Fetch form to apply custom Bootstrap validation
    var form = $("#edit-profile-form")
    alert(form.prop('id')) //test to ensure calling form correctly

    if (form[0].checkValidity() === false) {
      event.preventDefault()
      event.stopPropagation()
    }
    form.addClass('was-validated')
});
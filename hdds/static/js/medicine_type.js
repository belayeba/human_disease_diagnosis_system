 $("#registering_medicineType_form_block").hide();
function toggle_medicineType_registration_block(id)
{
    if(!id)
    {
        $("#registering_medicineType_form_block").slideToggle();
    }
    else
    {
        $("#registering_medicineType_form_block").show();
    }
}
function startMedicineType()
{
      $('#medicineType_table').DataTable().clear().destroy();
      $('#medicineType_table').dataTable({
        order: [[ 0, "desc" ]],
        columnDefs: [
            {
                name: 'name',
                width:"100%",
                orderable: true,
                searchable: true,
                targets: [0],

            },
            {
                mData: null,
                orderable: false,
                searchable: false,
                bSortable: false,
                targets: [1],
                mRender: function (data, type, row ) {

                    return '<a href="#" onclick=\'diplay_medicineType_update_form('+row[1]+',"'+row[0]+'");\'>edit</a>'; }
            },
            {
                mData: null,
                orderable: false,
                searchable: false,
                bSortable: false,
                targets: [2],
                mRender: function (data, type, row ) {
                    return '<a href="#" style="color:brown" onclick=\'delete_medicineType('+row[1]+',"'+row[0]+'");\'>delete</a>'; }
            }
           // {
              //  name: 'description',
              //  orderable: true,
              //  searchable: true,
              //  targets: [1]
           // }
        ],
        searching: true,
        processing: true,
        serverSide: true,
        stateSave: true,
        ajax: $("#medicineType_table").attr("data-url")
    });
}

function load_medicineType_name(key,url)
{
    $.ajax({
        url:url,
        method:"post",
        data:{key:key,'csrfmiddlewaretoken':csrf_token},
        dataType:"text",
        success:function(data)
        {
            $('#medicineType_name_browser').html(data);
        }
    });
}

$('#medicineType_registering_form').submit(function(event) {
        event.preventDefault();
        var formData = $(this).serialize();
        $.ajax({
            type        : 'POST',
            url         : $(this).attr('data-url'),
            data        : formData,
            dataType    : 'text',
            encode      : true
        })
            .done(function(data) {
                if(data=="yes")
                {
                     show_medicineType_notification("One data registered successfully!",1);
                    setTimeout(function(){
                        $("#medicineType_registration_success_alert").removeClass("d-block");
                    },5000);
                    startMedicineType();
                    $('#medicineType_registering_form')[0].reset();
                    load_medicineType_to_disease_registration_form();
                }
                else
                {
                    $("#medicineType_registration_name_error").html(data);
                    $("#medicineType_registration_name_error").addClass("d-block");
                    setTimeout(function(){
                        $("#medicineType_registration_name_error").removeClass("d-block");
                    },5000);
                }

            });

    });

function delete_medicineType(id,name)
{
     $("#medicineType_delete_confirmation_name").html(name);
     $("#medicineType_delete_confirmation").show();
     $('#medicineType_table_parent_div').addClass('disabledbutton')
     $("#medicineType_delete_yes_btn_id").attr("data-id",id)
}
function disable_medicineType_delete_confirmation()
{
     $("#medicineType_delete_confirmation_name").html("");
     $("#medicineType_delete_confirmation").hide();
     $('#medicineType_table_parent_div').removeClass('disabledbutton')
     $("#medicineType_delete_yes_btn_id").attr("data-id","")
}
function confirmed_delete_medicineType()
{
    id= $("#medicineType_delete_yes_btn_id").attr("data-id");
    disable_medicineType_delete_confirmation();
    $.ajax({
        url:$("#medicineType_delete_yes_btn_id").attr("data-url"),
        method:"post",
        data:{id:id,'csrfmiddlewaretoken':csrf_token},
        dataType:"text",
    })

     .done(function(data)
     {
                if(data=="yes")
                {
                    show_medicineType_notification("One data deleted successfully!",1)

                    $('#medicineType_table').DataTable().ajax.reload();
                    $('#medicineType_table').DataTable().ajax.reload();
                    load_medicineType_to_disease_registration_form();
                }
                else
                {
                    show_medicineType_notification(data,2);
                }
     });
}
function show_medicineType_notification(data,type)
{
     $("#medicineType_notification").css('opacity' ,'0.7');

    $("#medicineType_notification").show();
    $("#medicineType_notification_message").html(data);
    if(type==1) {
        $("#medicineType_notification").removeClass("alert-danger");
        $("#medicineType_notification").addClass("alert-success");

    }
    else{
        $("#medicineType_notification").removeClass("alert-success");
        $("#medicineType_notification").addClass("alert-danger");
    }

    setTimeout("hide_medicineType_notification()",8000);
    $("#medicineType_notification").fadeTo(1000, 1,function(){$("#medicineType_notification").fadeTo(7000, 0.0);});

}
function hide_medicineType_notification()
{
    $("#medicineType_notification").hide();
    $("#medicineType_notification_message").html("");
    $('#medicineType_table_parent_div').removeClass('disabledbutton')
}

function diplay_medicineType_update_form(id,name)
{
    $("#medicineType_update_popup").show();
    $('#medicineType_table_parent_div').addClass('disabledbutton')
    $("#medicineType_name_update").val(name);
    $("#medicineType_id_update").val(id);
}

function hide_medicineType_update_popup()
{
    $("#medicineType_name_update").val("");
    $("#medicineType_id_update").val("");
    $("#medicineType_update_popup").hide();
    $('#medicineType_table_parent_div').removeClass('disabledbutton')
}



$('#medicineType_update_form').submit(function(event) {
        event.preventDefault();
        var formData = $(this).serialize();
        $.ajax({
            type        : 'POST',
            url         : $(this).attr('data-url'),
            data        : formData,
            dataType    : 'text',
            encode      : true
        })
            .done(function(data) {
                if(data=="yes")
                {
                     hide_medicineType_update_popup();
                     show_medicineType_notification("One data updated successfully!",1);
                      $('#medicineType_table').DataTable().ajax.reload();
                      load_medicineType_to_disease_registration_form();
                }
                else
                {
                    $("#medicineType_update_name_error").html(data);
                    $("#medicineType_update_name_error").addClass("d-block");
                    setTimeout(function(){
                        $("#medicineType_update_name_error").removeClass("d-block");
                    },5000);
                }

            });

    });

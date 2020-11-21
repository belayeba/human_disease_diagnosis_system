 $("#registering_medicine_form_block").hide();
function toggle_medicine_registration_block()
{
    $("#registering_medicine_form_block").slideToggle();

}
function startMedicine()
{
      $('#medicine_table').DataTable().clear().destroy();
      $('#medicine_table').dataTable({
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

                    return '<a href="#" onclick=\'diplay_medicine_update_form('+row[1]+',"'+row[0]+'");\'>edit</a>'; }
            },
            {
                mData: null,
                orderable: false,
                searchable: false,
                bSortable: false,
                targets: [2],
                mRender: function (data, type, row ) {
                    return '<a href="#" style="color:brown" onclick=\'delete_medicine('+row[1]+',"'+row[0]+'");\'>delete</a>'; }
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
        ajax: $("#medicine_table").attr("data-url")
    });
}

function load_medicine_name(key,url)
{
    $.ajax({
        url:url,
        method:"post",
        data:{key:key,'csrfmiddlewaretoken':csrf_token},
        dataType:"text",
        success:function(data)
        {
            $('#medicine_name_browser').html(data);
        }
    });
}

$('#medicine_registering_form').submit(function(event) {
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
                     show_medicine_notification("One data registered successfully!",1);
                    setTimeout(function(){
                        $("#medicine_registration_success_alert").removeClass("d-block");
                    },5000);
                    startMedicine();
                    $('#medicine_registering_form')[0].reset();
                    load_medicine_to_disease_registration_form();
                }
                else
                {
                    $("#medicine_registration_name_error").html(data);
                    $("#medicine_registration_name_error").addClass("d-block");
                    setTimeout(function(){
                        $("#medicine_registration_name_error").removeClass("d-block");
                    },5000);
                }

            });

    });

function delete_medicine(id,name)
{
     $("#medicine_delete_confirmation_name").html(name);
     $("#medicine_delete_confirmation").show();
     $('#medicine_table_parent_div').addClass('disabledbutton')
     $("#medicine_delete_yes_btn_id").attr("data-id",id)
}
function disable_medicine_delete_confirmation()
{
     $("#medicine_delete_confirmation_name").html("");
     $("#medicine_delete_confirmation").hide();
     $('#medicine_table_parent_div').removeClass('disabledbutton')
     $("#medicine_delete_yes_btn_id").attr("data-id","")
}
function confirmed_delete_medicine()
{
    id= $("#medicine_delete_yes_btn_id").attr("data-id");
    disable_medicine_delete_confirmation();
    $.ajax({
        url:$("#medicine_delete_yes_btn_id").attr("data-url"),
        method:"post",
        data:{id:id,'csrfmiddlewaretoken':csrf_token},
        dataType:"text",
    })

     .done(function(data)
     {
                if(data=="yes")
                {
                    show_medicine_notification("One data deleted successfully!",1)

                    $('#medicine_table').DataTable().ajax.reload();
                    $('#medicine_table').DataTable().ajax.reload();
                    load_medicine_to_disease_registration_form();
                }
                else
                {
                    show_medicine_notification(data,2);
                }
     });
}
function show_medicine_notification(data,type)
{
     $("#medicine_notification").css('opacity' ,'0.7');

    $("#medicine_notification").show();
    $("#medicine_notification_message").html(data);
    if(type==1) {
        $("#medicine_notification").removeClass("alert-danger");
        $("#medicine_notification").addClass("alert-success");

    }
    else{
        $("#medicine_notification").removeClass("alert-success");
        $("#medicine_notification").addClass("alert-danger");
    }

    setTimeout("hide_medicine_notification()",8000);
    $("#medicine_notification").fadeTo(1000, 1,function(){$("#medicine_notification").fadeTo(7000, 0.0);});

}
function hide_medicine_notification()
{
    $("#medicine_notification").hide();
    $("#medicine_notification_message").html("");
    $('#medicine_table_parent_div').removeClass('disabledbutton')
}

function diplay_medicine_update_form(id,name)
{
    $("#medicine_update_popup").show();
    $('#medicine_table_parent_div').addClass('disabledbutton')
    $("#medicine_name_update").val(name);
    $("#medicine_id_update").val(id);
}

function hide_medicine_update_popup()
{
    $("#medicine_name_update").val("");
    $("#medicine_id_update").val("");
    $("#medicine_update_popup").hide();
    $('#medicine_table_parent_div').removeClass('disabledbutton')
}



$('#medicine_update_form').submit(function(event) {
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
                     hide_medicine_update_popup();
                     show_medicine_notification("One data updated successfully!",1);
                      $('#medicine_table').DataTable().ajax.reload();
                      load_medicine_to_disease_registration_form();
                }
                else
                {
                    $("#medicine_update_name_error").html(data);
                    $("#medicine_update_name_error").addClass("d-block");
                    setTimeout(function(){
                        $("#medicine_update_name_error").removeClass("d-block");
                    },5000);
                }

            });

    });

 $("#registering_measurement_form_block").hide();
function toggle_measurement_registration_block()
{
    $("#registering_measurement_form_block").slideToggle();

}
function startMeasurement()
{
      $('#measurement_table').DataTable().clear().destroy();
      $('#measurement_table').dataTable({
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

                    return '<a href="#" onclick=\'diplay_measurement_update_form('+row[1]+',"'+row[0]+'");\'>edit</a>'; }
            },
            {
                mData: null,
                orderable: false,
                searchable: false,
                bSortable: false,
                targets: [2],
                mRender: function (data, type, row ) {
                    return '<a href="#" style="color:brown" onclick=\'delete_measurement('+row[1]+',"'+row[0]+'");\'>delete</a>'; }
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
        ajax: $("#measurement_table").attr("data-url")
    });
}

function load_measurement_name(key,url)
{
    $.ajax({
        url:url,
        method:"post",
        data:{key:key,'csrfmiddlewaretoken':csrf_token},
        dataType:"text",
        success:function(data)
        {
            $('#measurement_name_browser').html(data);
        }
    });
}

$('#measurement_registering_form').submit(function(event) {
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
                     show_measurement_notification("One data registered successfully!",1);
                    setTimeout(function(){
                        $("#measurement_registration_success_alert").removeClass("d-block");
                    },5000);
                    startMeasurement();
                    $('#measurement_registering_form')[0].reset();
                    load_measurement_to_disease_registration_form();
                }
                else
                {
                    $("#measurement_registration_name_error").html(data);
                    $("#measurement_registration_name_error").addClass("d-block");
                    setTimeout(function(){
                        $("#measurement_registration_name_error").removeClass("d-block");
                    },5000);
                }

            });

    });

function delete_measurement(id,name)
{
     $("#measurement_delete_confirmation_name").html(name);
     $("#measurement_delete_confirmation").show();
     $('#measurement_table_parent_div').addClass('disabledbutton')
     $("#measurement_delete_yes_btn_id").attr("data-id",id)
}
function disable_measurement_delete_confirmation()
{
     $("#measurement_delete_confirmation_name").html("");
     $("#measurement_delete_confirmation").hide();
     $('#measurement_table_parent_div').removeClass('disabledbutton')
     $("#measurement_delete_yes_btn_id").attr("data-id","")
}
function confirmed_delete_measurement()
{
    id= $("#measurement_delete_yes_btn_id").attr("data-id");
    disable_measurement_delete_confirmation();
    $.ajax({
        url:$("#measurement_delete_yes_btn_id").attr("data-url"),
        method:"post",
        data:{id:id,'csrfmiddlewaretoken':csrf_token},
        dataType:"text",
    })

     .done(function(data)
     {
                if(data=="yes")
                {
                    show_measurement_notification("One data deleted successfully!",1)

                    $('#measurement_table').DataTable().ajax.reload();
                    $('#measurement_table').DataTable().ajax.reload();
                    load_measurement_to_disease_registration_form();
                }
                else
                {
                    show_measurement_notification(data,2);
                }
     });
}
function show_measurement_notification(data,type)
{
     $("#measurement_notification").css('opacity' ,'0.7');

    $("#measurement_notification").show();
    $("#measurement_notification_message").html(data);
    if(type==1) {
        $("#measurement_notification").removeClass("alert-danger");
        $("#measurement_notification").addClass("alert-success");

    }
    else{
        $("#measurement_notification").removeClass("alert-success");
        $("#measurement_notification").addClass("alert-danger");
    }

    setTimeout("hide_measurement_notification()",8000);
    $("#measurement_notification").fadeTo(1000, 1,function(){$("#measurement_notification").fadeTo(7000, 0.0);});

}
function hide_measurement_notification()
{
    $("#measurement_notification").hide();
    $("#measurement_notification_message").html("");
    $('#measurement_table_parent_div').removeClass('disabledbutton')
}

function diplay_measurement_update_form(id,name)
{
    $("#measurement_update_popup").show();
    $('#measurement_table_parent_div').addClass('disabledbutton')
    $("#measurement_name_update").val(name);
    $("#measurement_id_update").val(id);
}

function hide_measurement_update_popup()
{
    $("#measurement_name_update").val("");
    $("#measurement_id_update").val("");
    $("#measurement_update_popup").hide();
    $('#measurement_table_parent_div').removeClass('disabledbutton')
}



$('#measurement_update_form').submit(function(event) {
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
                     hide_measurement_update_popup();
                     show_measurement_notification("One data updated successfully!",1);
                      $('#measurement_table').DataTable().ajax.reload();
                      load_measurement_to_disease_registration_form();
                }
                else
                {
                    $("#measurement_update_name_error").html(data);
                    $("#measurement_update_name_error").addClass("d-block");
                    setTimeout(function(){
                        $("#measurement_update_name_error").removeClass("d-block");
                    },5000);
                }

            });

    });

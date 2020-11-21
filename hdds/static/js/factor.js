 $("#registering_factor_form_block").hide();
function toggle_factor_registration_block()
{
    $("#registering_factor_form_block").slideToggle();

}
function startFactor()
{
      $('#factor_table').DataTable().clear().destroy();
      $('#factor_table').dataTable({
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

                    return '<a href="#" onclick=\'diplay_factor_update_form('+row[1]+',"'+row[0]+'");\'>edit</a>'; }
            },
            {
                mData: null,
                orderable: false,
                searchable: false,
                bSortable: false,
                targets: [2],
                mRender: function (data, type, row ) {
                    return '<a href="#" style="color:brown" onclick=\'delete_factor('+row[1]+',"'+row[0]+'");\'>delete</a>'; }
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
        ajax: $("#factor_table").attr("data-url")
    });
}

function load_factor_name(key,url)
{
    $.ajax({
        url:url,
        method:"post",
        data:{key:key,'csrfmiddlewaretoken':csrf_token},
        dataType:"text",
        success:function(data)
        {
            $('#factor_name_browser').html(data);
        }
    });
}

$('#factor_registering_form').submit(function(event) {
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
                     show_factor_notification("One data registered successfully!",1);
                    setTimeout(function(){
                        $("#factor_registration_success_alert").removeClass("d-block");
                    },5000);
                    startFactor();
                    $('#factor_registering_form')[0].reset();
                    load_factor_to_disease_registration_form();
                }
                else
                {
                    $("#factor_registration_name_error").html(data);
                    $("#factor_registration_name_error").addClass("d-block");
                    setTimeout(function(){
                        $("#factor_registration_name_error").removeClass("d-block");
                    },5000);
                }

            });

    });

function delete_factor(id,name)
{
     $("#factor_delete_confirmation_name").html(name);
     $("#factor_delete_confirmation").show();
     $('#factor_table_parent_div').addClass('disabledbutton')
     $("#factor_delete_yes_btn_id").attr("data-id",id)
}
function disable_factor_delete_confirmation()
{
     $("#factor_delete_confirmation_name").html("");
     $("#factor_delete_confirmation").hide();
     $('#factor_table_parent_div').removeClass('disabledbutton')
     $("#factor_delete_yes_btn_id").attr("data-id","")
}
function confirmed_delete_factor()
{
    id= $("#factor_delete_yes_btn_id").attr("data-id");
    disable_factor_delete_confirmation();
    $.ajax({
        url:$("#factor_delete_yes_btn_id").attr("data-url"),
        method:"post",
        data:{id:id,'csrfmiddlewaretoken':csrf_token},
        dataType:"text",
    })

     .done(function(data)
     {
                if(data=="yes")
                {
                    show_factor_notification("One data deleted successfully!",1)

                    $('#factor_table').DataTable().ajax.reload();
                    $('#factor_table').DataTable().ajax.reload();
                    load_factor_to_disease_registration_form();
                }
                else
                {
                    show_factor_notification(data,2);
                }
     });
}
function show_factor_notification(data,type)
{
     $("#factor_notification").css('opacity' ,'0.7');

    $("#factor_notification").show();
    $("#factor_notification_message").html(data);
    if(type==1) {
        $("#factor_notification").removeClass("alert-danger");
        $("#factor_notification").addClass("alert-success");

    }
    else{
        $("#factor_notification").removeClass("alert-success");
        $("#factor_notification").addClass("alert-danger");
    }

    setTimeout("hide_factor_notification()",8000);
    $("#factor_notification").fadeTo(1000, 1,function(){$("#factor_notification").fadeTo(7000, 0.0);});

}
function hide_factor_notification()
{
    $("#factor_notification").hide();
    $("#factor_notification_message").html("");
    $('#factor_table_parent_div').removeClass('disabledbutton')
}

function diplay_factor_update_form(id,name)
{
    $("#factor_update_popup").show();
    $('#factor_table_parent_div').addClass('disabledbutton')
    $("#factor_name_update").val(name);
    $("#factor_id_update").val(id);
}

function hide_factor_update_popup()
{
    $("#factor_name_update").val("");
    $("#factor_id_update").val("");
    $("#factor_update_popup").hide();
    $('#factor_table_parent_div').removeClass('disabledbutton')
}



$('#factor_update_form').submit(function(event) {
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
                     hide_factor_update_popup();
                     show_factor_notification("One data updated successfully!",1);
                      $('#factor_table').DataTable().ajax.reload();
                      load_factor_to_disease_registration_form();
                }
                else
                {
                    $("#factor_update_name_error").html(data);
                    $("#factor_update_name_error").addClass("d-block");
                    setTimeout(function(){
                        $("#factor_update_name_error").removeClass("d-block");
                    },5000);
                }

            });

    });

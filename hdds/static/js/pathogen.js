 $("#registering_pathogen_form_block").hide();
function toggle_pathogen_registration_block()
{
    $("#registering_pathogen_form_block").slideToggle();

}
function startPathogen()
{
      $('#pathogen_table').DataTable().clear().destroy();
      $('#pathogen_table').dataTable({
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

                    return '<a href="#" onclick=\'diplay_pathogen_update_form('+row[1]+',"'+row[0]+'");\'>edit</a>'; }
            },
            {
                mData: null,
                orderable: false,
                searchable: false,
                bSortable: false,
                targets: [2],
                mRender: function (data, type, row ) {
                    return '<a href="#" style="color:brown" onclick=\'delete_pathogen('+row[1]+',"'+row[0]+'");\'>delete</a>'; }
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
        ajax: $("#pathogen_table").attr("data-url")
    });
}

function load_pathogen_name(key,url)
{
    $.ajax({
        url:url,
        method:"post",
        data:{key:key,'csrfmiddlewaretoken':csrf_token},
        dataType:"text",
        success:function(data)
        {
            $('#pathogen_name_browser').html(data);
        }
    });
}

$('#pathogen_registering_form').submit(function(event) {
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
                     show_pathogen_notification("One data registered successfully!",1);
                    setTimeout(function(){
                        $("#pathogen_registration_success_alert").removeClass("d-block");
                    },5000);
                    startPathogen();
                    $('#pathogen_registering_form')[0].reset();
                    load_pathogen_to_disease_registration_form();
                }
                else
                {
                    $("#pathogen_registration_name_error").html(data);
                    $("#pathogen_registration_name_error").addClass("d-block");
                    setTimeout(function(){
                        $("#pathogen_registration_name_error").removeClass("d-block");
                    },5000);
                }

            });

    });

function delete_pathogen(id,name)
{
     $("#pathogen_delete_confirmation_name").html(name);
     $("#pathogen_delete_confirmation").show();
     $('#pathogen_table_parent_div').addClass('disabledbutton')
     $("#pathogen_delete_yes_btn_id").attr("data-id",id)
}
function disable_pathogen_delete_confirmation()
{
     $("#pathogen_delete_confirmation_name").html("");
     $("#pathogen_delete_confirmation").hide();
     $('#pathogen_table_parent_div').removeClass('disabledbutton')
     $("#pathogen_delete_yes_btn_id").attr("data-id","")
}
function confirmed_delete_pathogen()
{
    id= $("#pathogen_delete_yes_btn_id").attr("data-id");
    disable_pathogen_delete_confirmation();
    $.ajax({
        url:$("#pathogen_delete_yes_btn_id").attr("data-url"),
        method:"post",
        data:{id:id,'csrfmiddlewaretoken':csrf_token},
        dataType:"text",
    })

     .done(function(data)
     {
                if(data=="yes")
                {
                    show_pathogen_notification("One data deleted successfully!",1)

                    $('#pathogen_table').DataTable().ajax.reload();
                    $('#pathogen_table').DataTable().ajax.reload();
                    load_pathogen_to_disease_registration_form();
                }
                else
                {
                    show_pathogen_notification(data,2);
                }
     });
}
function show_pathogen_notification(data,type)
{
     $("#pathogen_notification").css('opacity' ,'0.7');

    $("#pathogen_notification").show();
    $("#pathogen_notification_message").html(data);
    if(type==1) {
        $("#pathogen_notification").removeClass("alert-danger");
        $("#pathogen_notification").addClass("alert-success");

    }
    else{
        $("#pathogen_notification").removeClass("alert-success");
        $("#pathogen_notification").addClass("alert-danger");
    }

    setTimeout("hide_pathogen_notification()",8000);
    $("#pathogen_notification").fadeTo(1000, 1,function(){$("#pathogen_notification").fadeTo(7000, 0.0);});

}
function hide_pathogen_notification()
{
    $("#pathogen_notification").hide();
    $("#pathogen_notification_message").html("");
    $('#pathogen_table_parent_div').removeClass('disabledbutton')
}

function diplay_pathogen_update_form(id,name)
{
    $("#pathogen_update_popup").show();
    $('#pathogen_table_parent_div').addClass('disabledbutton')
    $("#pathogen_name_update").val(name);
    $("#pathogen_id_update").val(id);
}

function hide_pathogen_update_popup()
{
    $("#pathogen_name_update").val("");
    $("#pathogen_id_update").val("");
    $("#pathogen_update_popup").hide();
    $('#pathogen_table_parent_div').removeClass('disabledbutton')
}



$('#pathogen_update_form').submit(function(event) {
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
                     hide_pathogen_update_popup();
                     show_pathogen_notification("One data updated successfully!",1);
                      $('#pathogen_table').DataTable().ajax.reload();
                      load_pathogen_to_disease_registration_form();
                }
                else
                {
                    $("#pathogen_update_name_error").html(data);
                    $("#pathogen_update_name_error").addClass("d-block");
                    setTimeout(function(){
                        $("#pathogen_update_name_error").removeClass("d-block");
                    },5000);
                }

            });

    });

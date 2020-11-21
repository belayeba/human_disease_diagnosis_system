 $("#registering_medicineTakingWay_form_block").hide();
function toggle_medicineTakingWay_registration_block()
{
    $("#registering_medicineTakingWay_form_block").slideToggle();

}
function startMedicineTakingWay()
{
      $('#medicineTakingWay_table').DataTable().clear().destroy();
      $('#medicineTakingWay_table').dataTable({
        order: [[ 0, "desc" ]],
        columnDefs: [
            {
                description: 'description',
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

                    return '<a href="#" onclick=\'diplay_medicineTakingWay_update_form('+row[1]+',"'+row[0]+'");\'>edit</a>'; }
            },
            {
                mData: null,
                orderable: false,
                searchable: false,
                bSortable: false,
                targets: [2],
                mRender: function (data, type, row ) {
                    return '<a href="#" style="color:brown" onclick=\'delete_medicineTakingWay('+row[1]+',"'+row[0]+'");\'>delete</a>'; }
            }
           // {
              //  description: 'description',
              //  orderable: true,
              //  searchable: true,
              //  targets: [1]
           // }
        ],
        searching: true,
        processing: true,
        serverSide: true,
        stateSave: true,
        ajax: $("#medicineTakingWay_table").attr("data-url")
    });
}

function load_medicineTakingWay_description(key,url)
{
    $.ajax({
        url:url,
        method:"post",
        data:{key:key,'csrfmiddlewaretoken':csrf_token},
        dataType:"text",
        success:function(data)
        {
            $('#medicineTakingWay_description_browser').html(data);
        }
    });
}

$('#medicineTakingWay_registering_form').submit(function(event) {
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
                     show_medicineTakingWay_notification("One data registered successfully!",1);
                    setTimeout(function(){
                        $("#medicineTakingWay_registration_success_alert").removeClass("d-block");
                    },5000);
                    startMedicineTakingWay();
                    $('#medicineTakingWay_registering_form')[0].reset();
                    load_medicineTakingWay_to_disease_registration_form();
                }
                else
                {
                    $("#medicineTakingWay_registration_description_error").html(data);
                    $("#medicineTakingWay_registration_description_error").addClass("d-block");
                    setTimeout(function(){
                        $("#medicineTakingWay_registration_description_error").removeClass("d-block");
                    },5000);
                }

            });

    });

function delete_medicineTakingWay(id,description)
{
     $("#medicineTakingWay_delete_confirmation_description").html(description);
     $("#medicineTakingWay_delete_confirmation").show();
     $('#medicineTakingWay_table_parent_div').addClass('disabledbutton')
     $("#medicineTakingWay_delete_yes_btn_id").attr("data-id",id)
}
function disable_medicineTakingWay_delete_confirmation()
{
     $("#medicineTakingWay_delete_confirmation_description").html("");
     $("#medicineTakingWay_delete_confirmation").hide();
     $('#medicineTakingWay_table_parent_div').removeClass('disabledbutton')
     $("#medicineTakingWay_delete_yes_btn_id").attr("data-id","")
}
function confirmed_delete_medicineTakingWay()
{
    id= $("#medicineTakingWay_delete_yes_btn_id").attr("data-id");
    disable_medicineTakingWay_delete_confirmation();
    $.ajax({
        url:$("#medicineTakingWay_delete_yes_btn_id").attr("data-url"),
        method:"post",
        data:{id:id,'csrfmiddlewaretoken':csrf_token},
        dataType:"text",
    })

     .done(function(data)
     {
                if(data=="yes")
                {
                    show_medicineTakingWay_notification("One data deleted successfully!",1)

                    $('#medicineTakingWay_table').DataTable().ajax.reload();
                    $('#medicineTakingWay_table').DataTable().ajax.reload();
                    load_medicineTakingWay_to_disease_registration_form();
                }
                else
                {
                    show_medicineTakingWay_notification(data,2);
                }
     });
}
function show_medicineTakingWay_notification(data,type)
{
     $("#medicineTakingWay_notification").css('opacity' ,'0.7');

    $("#medicineTakingWay_notification").show();
    $("#medicineTakingWay_notification_message").html(data);
    if(type==1) {
        $("#medicineTakingWay_notification").removeClass("alert-danger");
        $("#medicineTakingWay_notification").addClass("alert-success");

    }
    else{
        $("#medicineTakingWay_notification").removeClass("alert-success");
        $("#medicineTakingWay_notification").addClass("alert-danger");
    }

    setTimeout("hide_medicineTakingWay_notification()",8000);
    $("#medicineTakingWay_notification").fadeTo(1000, 1,function(){$("#medicineTakingWay_notification").fadeTo(7000, 0.0);});

}
function hide_medicineTakingWay_notification()
{
    $("#medicineTakingWay_notification").hide();
    $("#medicineTakingWay_notification_message").html("");
    $('#medicineTakingWay_table_parent_div').removeClass('disabledbutton')
}

function diplay_medicineTakingWay_update_form(id,description)
{
    $("#medicineTakingWay_update_popup").show();
    $('#medicineTakingWay_table_parent_div').addClass('disabledbutton')
    $("#medicineTakingWay_description_update").val(description);
    $("#medicineTakingWay_id_update").val(id);
}

function hide_medicineTakingWay_update_popup()
{
    $("#medicineTakingWay_description_update").val("");
    $("#medicineTakingWay_id_update").val("");
    $("#medicineTakingWay_update_popup").hide();
    $('#medicineTakingWay_table_parent_div').removeClass('disabledbutton')
}



$('#medicineTakingWay_update_form').submit(function(event) {
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
                     hide_medicineTakingWay_update_popup();
                     show_medicineTakingWay_notification("One data updated successfully!",1);
                      $('#medicineTakingWay_table').DataTable().ajax.reload();
                      load_medicineTakingWay_to_disease_registration_form();
                }
                else
                {
                    $("#medicineTakingWay_update_description_error").html(data);
                    $("#medicineTakingWay_update_description_error").addClass("d-block");
                    setTimeout(function(){
                        $("#medicineTakingWay_update_description_error").removeClass("d-block");
                    },5000);
                }

            });

    });

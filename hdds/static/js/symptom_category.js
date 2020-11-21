 $("#registering_symptom_category_form_block").hide();
function toggle_symptomcategory_registration_block()
{
    $("#registering_symptom_category_form_block").slideToggle();

}
function startSymptomCategory()
{
      $('#symptom_category_table').DataTable().clear().destroy();
      $('#symptom_category_table').dataTable({
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

                    return '<a href="#" onclick=\'diplay_symptom_category_update_form('+row[1]+',"'+row[0]+'");\'>edit</a>'; }
            },
            {
                mData: null,
                orderable: false,
                searchable: false,
                bSortable: false,
                targets: [2],
                mRender: function (data, type, row ) {
                    return '<a href="#" style="color:brown" onclick=\'delete_symptom_category('+row[1]+',"'+row[0]+'");\'>delete</a>'; }
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
        ajax: $("#symptom_category_table").attr("data-url")
    });
}

function load_symptom_category_name(key,url)
{

    $.ajax({
        url:url,
        method:"post",
        data:{key:key,'csrfmiddlewaretoken':csrf_token},
        dataType:"text",
        success:function(data)
        {
            $('#symptom_category_name_browser').html(data);
        }
    });
}

$('#symptom_category_registering_form').submit(function(event) {
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
                     show_symptom_category_notification("One data registered successfully!",1);
                    setTimeout(function(){
                        $("#symptom_category_registration_success_alert").removeClass("d-block");
                    },5000);
                    startSymptomCategory();
                    $('#symptom_category_registering_form')[0].reset();
                    load_symptom_category_to_symptom_registration_form();
                }
                else
                {
                    $("#symptom_category_registration_name_error").html(data);
                    $("#symptom_category_registration_name_error").addClass("d-block");
                    setTimeout(function(){
                        $("#symptom_category_registration_name_error").removeClass("d-block");
                    },5000);
                }

            });

    });

function delete_symptom_category(id,name)
{
     $("#symptom_category_delete_confirmation_name").html(name);
     $("#symptom_category_delete_confirmation").show();
     $('#symptom_category_table_parent_div').addClass('disabledbutton')
     $("#symptom_category_delete_yes_btn_id").attr("data-id",id)
}
function disable_symptom_category_delete_confirmation()
{
     $("#symptom_category_delete_confirmation_name").html("");
     $("#symptom_category_delete_confirmation").hide();
     $('#symptom_category_table_parent_div').removeClass('disabledbutton')
     $("#symptom_category_delete_yes_btn_id").attr("data-id","")
}
function confirmed_delete_symptom_category()
{
    id= $("#symptom_category_delete_yes_btn_id").attr("data-id");
    disable_symptom_category_delete_confirmation();
    $.ajax({
        url:$("#symptom_category_delete_yes_btn_id").attr("data-url"),
        method:"post",
        data:{id:id,'csrfmiddlewaretoken':csrf_token},
        dataType:"text",
    })

     .done(function(data)
     {
                if(data=="yes")
                {
                    show_symptom_category_notification("One data deleted successfully!",1)

                    $('#symptom_category_table').DataTable().ajax.reload();
                    $('#symptom_table').DataTable().ajax.reload();
                    load_symptom_category_to_symptom_registration_form();
                }
                else
                {
                    show_symptom_category_notification(data,2);
                }
     });
}
function show_symptom_category_notification(data,type)
{
     $("#symptom_category_notification").css('opacity' ,'0.7');

    $("#symptom_category_notification").show();
    $("#symptom_category_notification_message").html(data);
    if(type==1) {
        $("#symptom_category_notification").removeClass("alert-danger");
        $("#symptom_category_notification").addClass("alert-success");

    }
    else{
        $("#symptom_category_notification").removeClass("alert-success");
        $("#symptom_category_notification").addClass("alert-danger");
    }

    setTimeout("hide_symptom_category_notification()",8000);
    $("#symptom_category_notification").fadeTo(1000, 1,function(){$("#symptom_category_notification").fadeTo(7000, 0.0);});

}
function hide_symptom_category_notification()
{
    $("#symptom_category_notification").hide();
    $("#symptom_category_notification_message").html("");
    $('#symptom_category_table_parent_div').removeClass('disabledbutton')
}

function diplay_symptom_category_update_form(id,name)
{
    $("#symptom_category_update_popup").show();
    $('#symptom_category_table_parent_div').addClass('disabledbutton')
    $("#symptom_category_name_update").val(name);
    $("#symptom_category_id_update").val(id);
}

function hide_symptom_category_update_popup()
{
    $("#symptom_category_name_update").val("");
    $("#symptom_category_id_update").val("");
    $("#symptom_category_update_popup").hide();
    $('#symptom_category_table_parent_div').removeClass('disabledbutton')
}



$('#symptom_category_update_form').submit(function(event) {
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
                     hide_symptom_category_update_popup();
                     show_symptom_category_notification("One data updated successfully!",1);
                      $('#symptom_category_table').DataTable().ajax.reload();
                      load_symptom_category_to_symptom_registration_form();
                }
                else
                {
                    $("#symptom_category_update_name_error").html(data);
                    $("#symptom_category_update_name_error").addClass("d-block");
                    setTimeout(function(){
                        $("#symptom_category_update_name_error").removeClass("d-block");
                    },5000);
                }

            });

    });

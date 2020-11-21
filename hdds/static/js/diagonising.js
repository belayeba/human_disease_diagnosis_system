function load_symptoms_for_diagonising()
{
    var data={'csrfmiddlewaretoken':csrf_token,key:$("#search-symptom-for-diagonising").val()};
    url=$("#search-symptom-for-diagonising").attr("data-url");
     $.ajax({
        url:url,
        type:"post",
        data:data,
        dataType:"text",
        success:function(data)
        {
               if(data=="")
               {
                    $("#loaded_symptom_list").html("<span style='color:red'>No symptom loaded!</span>");
               }
               else
               {
                    $("#loaded_symptom_list").html(data);
               }
        }
    });
}

function collapsing_symptom_for_diagonising(category_id)
{
    var state=0;
    if($('#collapsable_symptom_for_diagonising_'+category_id).is(":visible"))
    {
        state=1;
    }
    $(".collapsable_symptom_for_diagonising").hide();
    if(state==0)
    {
        $('#collapsable_symptom_for_diagonising_'+category_id).slideToggle();
    }

}
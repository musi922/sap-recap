sap.ui.define(["sap/ui/core/Control"],(Control)=>{
    return Control.extend("saprecap.control.CustomText",{
        metadata:{
            properties:{
                text:{type:"string", defaultValue:""},
                visible:{type:"boolean",defaultValue:true},
                style:{type:"string", defaultValue:""}
            }},
            renderer:{
                render(oRM,oControl){
                    oRM.openStart("span",oControl).class("customText").attr("style", oControl.getStyle()||"").openEnd()
                    if (oControl.getVisible()) {
                        oRM.text(oControl.getText())
                        
                    }
                    oRM.close("span")
                }
            }
    })
})
sap.ui.define(["sap/ui/core/Control"],(Control)=>{
    return Control.extend("saprecap.control.CustomButton",{
        metadata:{
            properties:{
                text:{type:"string", defaultValue:""},
                style:{type:"string", defaultValue:""},
                class:{type:"string",defaultValue:""}
            },
            events:{press:{}}
        },
        renderer:{
            render(oRM,oControl){
                oRM.openStart("button",oControl).class("customButton").class(oControl.getClass()).attr("style",oControl.getStyle()).openEnd()
                oRM.text(oControl.getText())
                oRM.close("button")
            },
           
        },
        onclick(){
            this.firePress()
        }
    })
})
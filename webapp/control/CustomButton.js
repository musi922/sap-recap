sap.ui.define(["sap/ui/core/Control"],(Control)=>{
    return Control.extend("saprecap.control.CustomButton",{
        metadata:{
            properties:{
                text:{type:"string", defaulValue:""},
                style:{type:"string", defaulValue:""},
                class:{type:"string",defaulValue:""}
            }
        },
        renderer:{
            render(oRM,oControl){
                oRM.openStart("")
            }
        }
    })
})
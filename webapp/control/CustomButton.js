sap.ui.define(["sap/ui/core/Control"],(Control)=>{
    return Control.extend("saprecap.control.CustomButton",{
        metadata:{
            properties:{
                text:{type:"string", defaultValue:""},
                style:{type:"string", defaultValue:""},
                class:{type:"string",defaultValue:""},
                visible:{type:"boolean",defaultValue:true}
            },
            events:{"customPress":{parameters:{
                "customData":{type:"string"}
            }}}
        },
        renderer:{
            render(oRM,oControl){
                oRM.openStart("button",oControl).class("customButton").class(oControl.getClass()).attr("style",oControl.getStyle()).openEnd()
                if(oControl.getVisible()){
                    oRM.text(oControl.getText())
                }
                oRM.close("button")
            },
           
        },
        onclick(){
            this.setText("Submitting")
            this.fireCustomPress({
                customData: "Button Clicked: " + this.getText()
            })
            setTimeout(() => {
                this.setText("Submited")
            }, 2000);
        }
    })
})
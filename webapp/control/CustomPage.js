sap.ui.define(["sap/ui/core/Control"],function (Control){
    return Control.extend("saprecap.control.CustomPage", {
        metadata: {
            properties: {
                title: { type: "string", defaultValue: "" },
                style: { type: "string", defaultValue: "" }
            },
            aggregations:{
                content:{type:"sap.ui.core.Control",multiple:true,singularName:"content"}
            }
            ,

            events:{
                onInit:{}
            }
        },

        renderer:{
            render:function(oRM,oControl){
                oRM.openStart("div",oControl).class("customPage").attr("style",oControl.getStyle()||"").openEnd()
                oRM.openStart("h3").openEnd()
                oRM.text(oControl.getTitle())
                oRM.close("h3")
                var aContent = oControl.getContent()
                if (aContent && aContent.length > 0) {
                    oRM.openStart("div").openEnd()
                    for (let i = 0; i < aContent.length; i++) {
                        oRM.renderControl(aContent[i])

                    }
                    oRM.close("div")

                    
                }
                oRM.close("div")
            }

        },
        onclick(){
            this.fireOnInit()
        }
    })
})
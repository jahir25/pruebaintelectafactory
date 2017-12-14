sap.ui.define([
   "sap/ui/entelantenas/controller/BaseController",
   "sap/ui/model/json/JSONModel",
   "sap/m/MessageToast",
   "sap/m/MessageBox",
], function (BaseController, JSONModel, MessageToast, MessageBox) {
    "use strict";
    var that;
    return BaseController.extend("sap.ui.entelantenas.controller.ListarHoja", {
        onInit : function () {
            var thes = this;
            var oRouter = this.getOwnerComponent().getRouter();
            this.getView().byId('hojaDatafill').getColumns()[0].setVisible(false);
            oRouter.getRoute("listarHoja").attachMatched(function(oEvent){
                that = this;
                thes.getHojaDatafill();
                thes.getcheckSession();
            }, this);
        },
        onPressBack: function(oEvent) {          
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("menuHoja");
        },
        OnPressLogout: function(){            
            var oRouter = this.getOwnerComponent().getRouter();
            $.ajax({
                url: 'model/logout.php',
                cache: false,
                timeout: 5000,
                type: "GET",
                success: function(result, status, xhr){
                    oRouter.navTo("login");
                },
                error: function(xhr, status, error){
                    MessageBox.error("Error de Conexion");
                },
                complete: function(){   
                } 
            });
        },
        getcheckSession: function(){
            var thes = this;
            var oRouter = this.getOwnerComponent().getRouter();
            $.ajax({
                url: 'model/checkSession.php',
                cache: false,
                timeout: 5000,
                type: "GET",
                success: function(result, status, xhr){
                    if (JSON.parse(result).acceso == "false") {
                        oRouter.navTo("login");
                    }
                },
                error: function(xhr, status, error){
                    MessageBox.error("Error de Conexion");
                },
                complete: function(){  
                } 
            });
        },
        getHojaDatafill: function(){
            var thes = this;
            $.ajax({
                url: 'model/getHojaDatafill.php',
                cache: false,
                timeout: 5000,
                type: "POST",
                data: JSON.stringify({query: 0}),
                success: function(result, status, xhr){
                    var resultado = JSON.parse(result);
                    $.each(resultado, function(i, v) {
                        if (v.estado == 1) {
                            resultado[i].ebool = true;
                        }else if(v.estado == 2){
                            resultado[i].ebool = false;
                        }
                    });
                    var oModel = new JSONModel(resultado);
                    thes.getView().byId('hojaDatafill').setModel(oModel);
                    console.log(resultado);
                },
                error: function(xhr, status, error){
                    MessageBox.error("Error de Conexion");
                },
                complete: function(){
                    
                } 
            });
        },
        onGoEdit: function(oEvent){
            var id_hoja = btoa(oEvent.getSource().oParent.oParent.mAggregations.cells[0].mProperties.text);
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("editarHoja", {
                "id_hoja": id_hoja
            });
        },
        onUpdateEstado: function(oEvent){            
            var id = oEvent.getSource().oParent.mAggregations.cells[0].mProperties.text;
            var codigo = oEvent.getSource().oParent.mAggregations.cells[1].mProperties.text;
            var state = oEvent.getSource().oParent.mAggregations.cells[2].mProperties.state;
            var sId = oEvent.getSource().sId;
            
            var Parameters = {
                id : id,
                state : state
            };

            var action = "";
            if(state == true){
                action = "activar";
            }else{
                action ="desactivar"
            }
            console.log(Parameters);
            sap.ui.core.BusyIndicator.show(0);
            MessageBox.confirm("Desea "+ action +" el hoja: "+ codigo, {
              icon: sap.m.MessageBox.Icon.CONFIRM,
              title: "Confirmación",
              actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
              onClose: function(oAction) {
                  if ( oAction == sap.m.MessageBox.Action.YES ) {
                    $.ajax({
                        url: 'model/deleteHoja.php',
                        cache: false,
                        timeout: 5000,
                        type: "POST",
                        data: JSON.stringify(Parameters),
                        success: function(result, status, xhr){
                            result = JSON.parse(result);
                            if(result.type == "s"){
                                /*MessageBox.success(result.success);*/
                                sap.ui.core.BusyIndicator.hide();
                                that.getHojaDatafill();
                                /*click = 1;
                                that.goTo(click);*/
                            }else{
                                MessageBox.error(result.error);
                            }
                        },
                        error: function(xhr, status, error){
                            MessageBox.error("Error de conexión");
                        },
                        complete: function(){                    
                        } 
                    });
                  }else{                      
                      if(state == true)
                        state = false;
                      else
                        state = true;
                  }                  
                  sap.ui.getCore().byId(sId).setState(state);
                  sap.ui.core.BusyIndicator.hide();
              }
            });
        }
        
    });
});
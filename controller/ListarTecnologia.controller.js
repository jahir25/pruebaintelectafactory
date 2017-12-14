sap.ui.define([
   "sap/ui/entelantenas/controller/BaseController",
   "sap/ui/model/json/JSONModel",
   "sap/m/MessageToast",
   "sap/m/MessageBox",
], function (BaseController, JSONModel, MessageToast, MessageBox) {
    "use strict";
    var that;
    return BaseController.extend("sap.ui.entelantenas.controller.ListarTecnologia", {
        onInit : function () {
            var thes = this;
            that = this;
            var oRouter = this.getOwnerComponent().getRouter();
            this.getView().byId('tecnologialista').getColumns()[0].setVisible(false);
            oRouter.getRoute("listarTecnologia").attachMatched(function(oEvent){
                thes.getTecnologia();
                thes.getcheckSession();
            }, this);
        },
        onPressBack: function(oEvent) {          
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("menuTecnologia");
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
                    MessageBox.error("Error de Conexión");
                },
                complete: function(){  
                } 
            });
        },
        getTecnologia: function(){
            var thes = this;
            $.ajax({
                url: 'model/getTecnologia.php',
                cache: false,
                timeout: 5000,
                type: "GET",
                success: function(result, status, xhr){
                    var resultado = JSON.parse(result);                    
                    var oModel = new JSONModel(resultado);
                    thes.getView().byId('tecnologialista').setModel(oModel);
                },
                error: function(xhr, status, error){
                    MessageBox.error("Error de Conexion");
                },
                complete: function(){
                    
                } 
            });

        },
        onUpdate: function(oEvent){
            var id_tecnologia = oEvent.getSource().oParent.mAggregations.cells[0].mProperties.text;
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("editarTecnologia", {'id_tecnologia': id_tecnologia});
        },
        onDelete: function(oEvent){            
            var id_tec = oEvent.getSource().oParent.mAggregations.cells[0].mProperties.text;
            var codigo = oEvent.getSource().oParent.mAggregations.cells[1].mProperties.text;            
            var state = oEvent.getSource().oParent.mAggregations.cells[2].mProperties.state;
                        
            var sId = oEvent.getSource().sId;
            var json = {
                value: id_tec,
                state: state                
            };
            
            var action = "";
            if(state == true){
                action = "activar";
            }else{
                action ="desactivar"
            }
            sap.ui.core.BusyIndicator.show(0);
             MessageBox.confirm("Desea "+ action +" el sector: "+ codigo, {
              icon: sap.m.MessageBox.Icon.CONFIRM,
              title: "Confirmación",
              actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
              onClose: function(oAction) {
                  if ( oAction == sap.m.MessageBox.Action.YES ) {
                    $.ajax({
                        url: 'model/deleteTecnologia.php',
                        cache: false,
                        timeout: 5000,
                        type: "POST",
                        data: JSON.stringify(json),
                        success: function(result, status, xhr){
                            result = JSON.parse(result);
                            if(result.type == "s"){
                                /*MessageBox.success(result.success);*/
                                sap.ui.core.BusyIndicator.hide();
                                that.getTecnologia();
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
                  console.log(state);
                  sap.ui.getCore().byId(sId).setState(state);
                  sap.ui.core.BusyIndicator.hide();
              }
            });
        }
    });
});
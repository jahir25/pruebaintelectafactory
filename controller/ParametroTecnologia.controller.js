sap.ui.define([
   "sap/ui/entelantenas/controller/BaseController",
   "sap/ui/model/json/JSONModel",
   "sap/m/MessageToast",
   "sap/m/MessageBox"
], function (BaseController, JSONModel, MessageToast, MessageBox) {
    "use strict";
    var rou = 0;
    var that;
    var tbParametros = '';
    return BaseController.extend("sap.ui.entelantenas.controller.ParametroTecnologia", {
        onInit : function () {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("parametroTecnologia").attachMatched(function(oEvent){
                that = this;
                that.getView().byId('parametros').getColumns()[0].setVisible(false);
                rou = atob(oEvent.getParameter("arguments").sPath);
            	that.getParametros(rou);
                that.getcheckSession();
            }, this);
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
                    sap.m.MessageBox.error("Error de Conexion");
                },
                complete: function(){  
                } 
            });
        },
        onPressBack: function(oEvent) {          
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("listarParametro");
        },
        getParametros: function(data){            
            var Parameters = {
                'data' : data,
            };
            $.ajax({
                url: 'model/getParametros.php',
                cache: false,
                timeout: 5000,
                type: "GET",
                data: Parameters,
                success: function(result, status, xhr){
                    result = JSON.parse(result);
                    var oModel = new JSONModel(result);
                    that.getView().byId('parametros').setModel(oModel);
                    tbParametros = that.getView().byId('parametros');
                },
                error: function(xhr, status, error){
                    sap.m.MessageBox.error("Error de Conexion");
                },
                complete: function(){
                    
                } 
            });
        },
        onSelectionChange: function(oEvent){
            var sPath = oEvent.getSource("listItem");
            return sPath;
        },
        onUpdate: function(oEvent){
            var id_parametro = oEvent.getSource().oParent.mAggregations.cells[0].mProperties.text;
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("editarParametro", {'id_parametro': id_parametro, 'id_tecnologia': rou});
        },
        onDelete: function(oEvent){            
            var codigo = oEvent.getSource().oParent.mAggregations.cells[0].mProperties.text;            
            var nombre_parametro = oEvent.getSource().oParent.mAggregations.cells[2].mProperties.text;            
            var state = oEvent.getSource().oParent.mAggregations.cells[6].mProperties.state;
            var sId = oEvent.getSource().sId;
            var json = {
                tabla: "parametros", 
                field: "id_parametro",
                value: codigo,
                state: state                
            };
            var action = "";
            if(state == true){
                action = "activar";
            }else{
                action ="desactivar"
            }
            sap.ui.core.BusyIndicator.show(0);
            sap.m.MessageBox.confirm("Desea "+ action +" el sector: "+ nombre_parametro, {
              icon: sap.m.MessageBox.Icon.CONFIRM,
              title: "Confirmación",
              actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
              onClose: function(oAction) {
                  if ( oAction == sap.m.MessageBox.Action.YES ) {
                    $.ajax({
                        url: 'model/deleteParametro.php',
                        cache: false,
                        timeout: 5000,
                        type: "POST",
                        data: JSON.stringify(json),
                        success: function(result, status, xhr){
                            result = JSON.parse(result);
                            if(result.type == "s"){
                                /*MessageBox.success(result.success);*/
                                sap.ui.core.BusyIndicator.hide();
                                that.getParametros(rou);
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
                      that.getParametros(rou);
                      /*if(state == true)
                        state = false;
                      else
                        state = true;*/
                  }
                  console.log(state);
                  /*sap.ui.getCore().byId(sId).setState(state);*/
                  sap.ui.core.BusyIndicator.hide();
              }
            });
        }
    });
});
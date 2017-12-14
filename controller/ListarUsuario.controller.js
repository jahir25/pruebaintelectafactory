sap.ui.define([
   "sap/ui/entelantenas/controller/BaseController",
   "sap/ui/model/json/JSONModel",
   "sap/m/MessageBox"
], function (BaseController, JSONModel, MessageBox) {
    "use strict";
    var that;
    var click = 0;
    return BaseController.extend("sap.ui.entelantenas.controller.ListarUsuario", {
        onInit : function () {
            that = this;            
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("listarUsuario").attachMatched(function(oEvent) {
                sap.ui.core.BusyIndicator.show(0);
                that.getcheckSession();
                that.getUsuarios();
                that.getView().byId('usuarios').getColumns()[0].setVisible(false);                
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

        /*onAfterRendering : function() {
            that = this;
            sap.ui.core.BusyIndicator.show(0);
        	this.getUsuarios();
            that.getView().byId('usuarios').getColumns()[0].setVisible(false);
        },*/    
        getUsuarios: function(){        	
        	$.ajax({
                url: 'model/getUsuario.php',
                cache: false,
                timeout: 5000,
                type: "GET",
                success: function(result, status, xhr){                    
                    var oModel = new JSONModel(JSON.parse(result));
                    $.each(oModel.getData(), function(key, item){
                        if(parseInt(item.estado) == 1){
                            item.estado = true;
                        }else if(parseInt(item.estado) == 2){
                            item.estado = false;
                        }
                    });
                    console.log(oModel.getData());
                    that.getView().byId('usuarios').setModel(oModel);
                },
                error: function(xhr, status, error){
                    MessageBox.error("Error de Conexion");
                },
                complete: function(){
                    
                } 
            });
            setTimeout(function(){
                click = 1;
                that.goTo(click);
                that.getView().byId("btnAnterior").setEnabled(false);    
            }, 1000);
            sap.ui.core.BusyIndicator.hide();
        },
        onPressBack: function(oEvent) {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("menuUsuario");
        },
        onPressMenu: function(oEvent) {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("menuUsuario");                
        },
        range: function(oInit, oEnd, oData){
            var tmp=[];

            $.each(oData, function(key, item){
                var sId = item.sId;
                if(key >= oInit && key <= oEnd){
                    sap.ui.getCore().byId(sId).setVisible(true);
                }else{                    
                    sap.ui.getCore().byId(sId).setVisible(false);
                }
                /*return;*/
            });
            /*return tmp;*/            
            /*this.getView().byId("usuarios").setBusy(false);*/
        },
        goTo: function(oClick){
            /*this.getView().byId("usuarios").setBusy(true);*/
            var oSelectItem = this.getView().byId("sShow").getSelectedKey();
            var oTable =  this.getView().byId("usuarios").getItems();
            /*var oTable = this.oData().oData;*/
            var oTotal = oTable.length;
            var oShow = Math.ceil(oTotal / oSelectItem);            
            if(oClick <= oShow){
                if(oShow == oClick && oTable.length != 0){
                   this.getView().byId("btnSiguiente").setEnabled(false);
                }else{
                   this.getView().byId("btnSiguiente").setEnabled(true);
                }
                var range = this.range(oSelectItem * (oClick - 1), (oSelectItem * oClick) - 1, oTable);
                /*var model = new JSONModel(range);
                this.getView().byId("usuarios").setModel(model);*/                
            }
            /*this.getView().byId("usuarios").setBusy(false);*/
        },
        goNext: function(){
            this.goTo(click += 1);
            if(click != 0){
                this.getView().byId("btnAnterior").setEnabled(true);
            }else{
                this.getView().byId("btnAnterior").setEnabled(false);
            }
        },
        goPrevious: function(){
            this.goTo(click -= 1);
            if(click == 1){
                this.getView().byId("btnAnterior").setEnabled(false);
            }else{
                this.getView().byId("btnAnterior").setEnabled(true);
            }
        },
        onFiltros: function(oId){
            this._oDialog = sap.ui.xmlfragment("sap.ui.entelantenas.fragment.Filtros", this);
            var oColumns = this.getView().byId("usuarios").mAggregations.columns;
            var columnsArray = new Array();
            var oModel = new JSONModel();
            
            for(var item of oColumns){                
                var column = item.mAggregations.header.mProperties.text;                
                var sId = item.mAggregations.header.oParent.sId;
                var id = sId.substring(sId.lastIndexOf("--") + 2, sId.length);
                columnsArray.push({"column":  column, "sId": id});
            }

            oModel.setData(columnsArray);
            sap.ui.getCore().byId("tblColumns").setModel(oModel);
            sap.ui.getCore().byId("sId").setVisible(false);
            this._oDialog.open();
        },
        onAction: function(oEvent){            
            var oFilter = sap.ui.getCore().byId("Filtrar").getValue();
            var oOrderA = sap.ui.getCore().byId("A").getSelected();
            var oOrderD = sap.ui.getCore().byId("D").getSelected();
            var oSelected1 = oEvent.getSource().oParent.mAggregations.cells[0].mProperties.selected;
            var oGroup1 = oEvent.getSource().oParent.mAggregations.cells[0].mProperties.groupName;
            var oSelected2 = oEvent.getSource().oParent.mAggregations.cells[1].mProperties.selected;
            var oGroup2 = oEvent.getSource().oParent.mAggregations.cells[1].mProperties.groupName;
            var oColumn = oEvent.getSource().oParent.mAggregations.cells[3].mProperties.text;
            var controlRerender = 0;
            oSelected1 = oSelected1?true:false;
            oSelected2 = oSelected2?true:false;
            oFilter = oFilter?oFilter:null;
            
            if(oGroup1 == "b"){
                var oView = this.getView();
                var oTable = oView.byId("usuarios");
                var oBinding = oTable.getBinding("items");            
                
                controlRerender += 1;
                var sPath = oColumn;
                var bDescending = oOrderD;
                /*var aSorters = [];*/
                /*aSorters.push(new sap.ui.model.Sorter(sPath, bDescending));                */
                var oSorter = new sap.ui.model.Sorter(sPath, bDescending);
                
                oBinding.sort(oSorter);
                oBinding.refresh();
                this.goTo(click);
            }
            if(oGroup2 == "c" && oFilter != null){
                var oView = this.getView();
                var oTable = oView.byId("usuarios");
                var oBinding = oTable.getBinding("items");
                controlRerender = 2;
                
                var aFilters = [];
                var sPath = oColumn;
                var sOperator = "EQ";
                var sValue1 = oFilter;
                var vFilter = new sap.ui.model.Filter(sPath, sOperator, sValue1);

                aFilters.push(vFilter);
                oBinding.filter(aFilters);
                this.goTo(click);
            }
            
            if(oFilter == null && controlRerender == 2){
                this.getView().byId("usuarios").setModel(that.oData());
                click = 1;
                this.goTo(click);
            }
        },
        onOrder: function(oEvent){
            /*var oOrder = oEvent.getSource()mProperties.text;
            console.log(oOrder);
            if(oOrder == "Descendente"){
                return true;
            }else if(oOrder == "Ascendente"){
                return false;
            }else{
                return null;
            }*/
        },
        goFiltro(){
            this._oDialog.destroy();
        },
        onShow: function(){
            click = 1;
            this.goTo(click);
        },
        onClose: function(){
            this._oDialog.destroy();
        },
        onAccept: function(){
            this._oDialog.destroy();
        },        
        oEscape: function() {
            this._oDialog.destroy();
        },
        onUpdate: function(oEvent){
            var id_usuario = oEvent.getSource().oParent.mAggregations.cells[0].mProperties.text;
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("editarUsuario", {
                "id_usuario": id_usuario
            });            
        },
        onDelete: function(oEvent){
            var id_usuario = oEvent.getSource().oParent.mAggregations.cells[0].mProperties.text;
            var login = oEvent.getSource().oParent.mAggregations.cells[1].mProperties.text;
            var state = oEvent.getSource().oParent.mAggregations.cells[7].mProperties.state;
            var sId = oEvent.getSource().sId;
            /*sId = sId.substring(sId.lastIndexOf("usuarios") + 9, sId.length);*/
            var json = {"id_usuario": id_usuario, "state": state};
            var action = "";
            if(state == true){
                action = "activar";
            }else{
                action ="desactivar"
            }
            sap.m.MessageBox.confirm("Desea "+ action +" al usuario: "+ login, {
              icon: sap.m.MessageBox.Icon.CONFIRM,
              title: "Confirmación",
              actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
              onClose: function(oAction) {
                  sap.ui.core.BusyIndicator.show(0);
                  if ( oAction === sap.m.MessageBox.Action.YES ) {
                    $.ajax({
                        url: 'model/deleteUsuario.php',
                        cache: false,
                        timeout: 5000,
                        type: "POST",
                        data: JSON.stringify(json),
                        success: function(result, status, xhr){
                            result = JSON.parse(result);
                            if(result.type == "s"){
                                /*var ok = MessageBox.success(result.success);*/
                                that.getUsuarios();
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
                  sap.ui.core.BusyIndicator.hide();
                  sap.ui.getCore().byId(sId).setState(state);
              }
            });
        }
        /*ajax: function(root, type, json){
            sap.ui.core.BusyIndicator.show(0);
            var oData = [];
            $.ajax({
                url: root,
                cache: false,
                timeout: 5000,
                type: type,
                data: JSON.stringify(json),
                success: function(result, status, xhr){
                     oData = JSON.parse(result);
                },
                error: function(xhr, status, error){
                    oData = {"error": "Error de conexión", "type": "e"};
                },
                complete: function(){                    
                } 
            });
            console.log(oData);
            return oData;
        }*/
    });
});
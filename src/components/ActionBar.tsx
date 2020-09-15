import { Toolbar } from "primereact/toolbar";
import React from "react";

function ActionBar (props: {children?: any, 
        leftToolbarTemplate: ((props: object) => any) | undefined}) {
    return(<Toolbar className="p-mb-4" left={props.leftToolbarTemplate}></Toolbar>);
}

export default ActionBar;
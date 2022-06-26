
/*
The return object format MUST contain the field 'success':
{success:true}

If the result of your code is 'false' then return:
{success:false, erroeMessage:{the reason why it is false}}
The error Message is importent! it will be written in the audit log and help the user to understand what happen
*/

import { Client, Request } from '@pepperi-addons/debug-server'
import { Relation } from '@pepperi-addons/papi-sdk'
import MyService from './my.service';

export async function install(client: Client, request: Request): Promise<any> {
    // For block template uncomment this.
    const res = await createBlockRelation(client);
    // return res;
    return {success: res.success, errorMessage: res.resultObject};
}

export async function uninstall(client: Client, request: Request): Promise<any> {
    return {success:true,resultObject:{}}
}

export async function upgrade(client: Client, request: Request): Promise<any> {
    return {success:true,resultObject:{}}
}

export async function downgrade(client: Client, request: Request): Promise<any> {
    return {success:true,resultObject:{}}
}

async function createBlockRelation(client: Client): Promise<any> {
    try {
        // TODO: change to block name (this is the unique relation name and the description that will be on the block).
        const blockName = 'ScriptBlockClient';
        const filename = `file_${client.AddonUUID.replace(/-/g, '_').toLowerCase()}`;

        const pageComponentRelation: Relation = {
            RelationName: 'PageBlock',
            Name: blockName,
            Description: `${blockName} block`,
            Type: "NgComponent",
            SubType: "NG11",
            AddonUUID: client.AddonUUID,
            AddonRelativeURL: filename,
            ComponentName: `${blockName}Component`, // This is should be the block component name (from the client-side)
            ModuleName: `${blockName}Module`, // This is should be the block module name (from the client-side)
            EditorComponentName:`${blockName}EditorComponent`,
            EditorModuleName:`${blockName}EditorModule`,
            Schema: {
                "Fields": {
                    "scriptConfig":{
                        "Type": "Object",
                        "Fields": {
                            "editIndex": {
                                "Type": "String"
                            },
                            "hideLoader": {
                                "Type": "Bool"
                            },
                            "matchContHeight": {
                                "Type": "Bool"
                            },
                            "height": {
                                "Type": "String"
                            },
                            "minDelay": {
                                "Type": "String"
                            }
                        }
                    },
                    "scripts": {
                        "Type": "Array",
                        "Items": {
                            "Type": "Object",
                            "Fields": {
                                "id": {
                                    "Type": "number"  
                                },
                                "key": {
                                    "Type": "String"  
                                },
                                "script": {
                                    "Type": "String"  
                                }
                            }
                        }
                    }
                }
            }
        };

        const service = new MyService(client);
        const result = await service.upsertRelation(pageComponentRelation);
        return { success:true, resultObject: result };
    } catch(err) {
        return { success: false, resultObject: err , errorMessage: `Error in upsert relation. error - ${err}`};
    }
}
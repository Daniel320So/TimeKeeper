import inquirer from 'inquirer';
import { readApiConfig, writeApiConfig } from '../utils.js';

let apiData;



const ACTIONS = {
    EXPORT_EXCEL: "exportExcel",
    SET_API_KEY: "setApiKey",
    SET_WROKSPACE_ID: "setWorkplaceId",
    EXIT: "exit"
};

const APIKeyPrompt = async function () {
  const APIKeyPrompt = inquirer.createPromptModule();
  await APIKeyPrompt([
    {
      type: "input",
      name: "key",
      message: "Please provide your api key",
    },
  ])
    .then(async(answers) => {
      //Update API_KEY in JSON file
      apiData.API_KEY = answers.key;
      await writeApiConfig(apiData)
    })
    .catch((error) => {
      console.log(error);
    });
};

export async function startCli(){

    let action;
    apiData = await readApiConfig();

    //Ask the user to setup API key if it is not setup yet
    if (!apiData.API_KEY || apiData.API_KEY === "") await APIKeyPrompt();

    //Ask the user for the next actions
    const actionPrompt = inquirer.createPromptModule();
    await actionPrompt([{
        type: "rawlist",
        name: "action",
        message: "Please select an option below",
        choices: [
            {
                name: "Export Timesheet to Excel File", 
                value: ACTIONS.EXPORT_EXCEL
            },{
                name: "Update API Key", 
                value: ACTIONS.SET_API_KEY
            }, {
                name: "Update Workspace ID", 
                value: ACTIONS.SET_WROKSPACE_ID
            }, {
                name: "Exit", 
                value: ACTIONS.EXIT
            }
    ]}]).then((answers) => {
        action = answers.action;
    }).catch((error) => {
        // console.log(error)
    });

    //Switch according to the action
    switch(action){
        case ACTIONS.EXPORT_EXCEL:
            break;
        case ACTIONS.SET_API_KEY:
            await APIKeyPrompt();
            console.log("API Key is updated to", apiData.API_KEY);
            break;
        case ACTIONS.SET_WROKSPACE_ID:
            break;
        case ACTIONS.EXIT:
            console.log("Terminating Application");
            process.exit();
    };

    await startCli()
}


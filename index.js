function capitalize(s) {
  return s[0].toUpperCase() + s.slice(1);
}

function lowerCase(s) {
  return s[0].toLowerCase() + s.slice(1);
}

function getQuery() {
  let query = '';
  const { argv } = process;
  const args = argv.slice(2, argv.length);
  if (!args.length) {
    throw Error('Parameters are required.');
  }
  args.forEach(arg => {
    const argument = arg.split('=');
    let argumentFlag = '';
    let sliceUpto = 0;
    if (arg[0] === '-') sliceUpto = 1;
    if (arg.slice(0, 2) === '--') sliceUpto = 2;
    argumentFlag = argument[0].slice(sliceUpto, argument[0].length);
    if (argumentFlag === 'q' || argumentFlag === 'query') {
      query = argument.length > 1 ? argument[1] : '';
    }
  });
  return query.replace(/eq/g, '=');
}

(() => {
  const query = getQuery();
  const parts = query.split('|');
  const modelName = capitalize(parts[0]);
  const existingRepo = capitalize(parts[1]);
  const httpMethod = parts[2];
  const newMethod = parts[3];
  const params = parts[4].split(',') || [];
  const inputParams = {};
  let queryMethod = '';
  switch (httpMethod) {
    case 'get':
      queryMethod = 'find';
      break;
    case 'post':
      queryMethod = 'create';
      break;
  }
  params.forEach((param) => {
    const paramParts = param.split(':');
    inputParams[paramParts[0]] = paramParts[1];
  });
  const sqlQuery = parts[5];
  console.log('Model Name: ', modelName);
  console.log('Existing Repo: ', existingRepo);
  console.log('New Method: ', newMethod);
  console.log('HTTP Method: ', httpMethod);
  console.log('Input Params: ', inputParams);
  console.log('SQL query: ', sqlQuery);
  const imports = `
  import {${modelName}} from '../models';
  import {${existingRepo}} from '../repositories';
  import {repository} from '@loopback/repository';
  import {get, getModelSchemaRef, param, requestBody, response} from '@loopback/rest';
  `;
  const constructor = `constructor(@repository(${existingRepo})
    public ${lowerCase(existingRepo)}: ${existingRepo},) {}`;
  const customRoute = `${httpMethod}('/${newMethod}')
    @response(200, {
      description: '${modelName} custom model instance',
      content: {'application/json': {schema: getModelSchemaRef(${modelName})}},
    })
    async ${queryMethod}(@param.filter(${modelName}) filter?: Filter<${modelName}>): Promise<${modelName}[]> {
      return this.${lowerCase(modelName)}.execute('${sqlQuery}');
    }
  `;
  const controller = `
  ${imports}
  export class ${modelName}Controller {
    ${constructor}

    ${customRoute}
  }`;
  console.log(controller);
})();


/*

interface InputParams {
  [key: string]: unknown;
}

function capitalize(s: string) {
  return s[0].toUpperCase() + s.slice(1);
}

function lowerCase(s: string) {
  return s[0].toLowerCase() + s.slice(1);
}

function getQuery() {
  let query = '';
  const {argv} = process;
  const args = argv.slice(2, argv.length);
  if (!args.length) {
    throw Error('Parameters are required.');
  }
  args.forEach(arg => {
    const argument = arg.split('=');
    let argumentFlag = '';
    let sliceUpto = 0;
    if (arg[0] === '-') sliceUpto = 1;
    if (arg.slice(0, 2) === '--') sliceUpto = 2;
    argumentFlag = argument[0].slice(sliceUpto, argument[0].length);
    if (argumentFlag === 'q' || argumentFlag === 'query') {
      query = argument.length > 1 ? argument[1] : '';
    }
  });
  return query.replace(/eq/g, '=');
}

(() => {
  const query = getQuery();
  const parts = query.split('|');
  const modelName = capitalize(parts[0]);
  const existingRepo = capitalize(parts[1]);
  const httpMethod = parts[2];
  const newMethod = parts[3];
  const params = parts[4].split(',') || [];
  const inputParams: InputParams = {};
  let queryMethod = '';
  switch (httpMethod) {
    case 'get':
      queryMethod = 'find';
      break;
    case 'post':
      queryMethod = 'create';
      break;
  }
  params.forEach((param: string) => {
    const paramParts = param.split(':');
    inputParams[paramParts[0]] = paramParts[1] as unknown as string;
  });
  const sqlQuery = parts[5];
  console.log('Model Name: ', modelName);
  console.log('Existing Repo: ', existingRepo);
  console.log('New Method: ', newMethod);
  console.log('HTTP Method: ', httpMethod);
  console.log('Input Params: ', inputParams);
  console.log('SQL query: ', sqlQuery);
  const imports = `
  import {${modelName}} from '../models';
  import {${existingRepo}} from '../repositories';
  import {repository} from '@loopback/repository';
  import {get, getModelSchemaRef, param, requestBody, response} from '@loopback/rest';
  `;
  const constructor = `constructor(@repository(${existingRepo})
    public ${lowerCase(existingRepo)}: ${existingRepo},) {}`;
  const customRoute = `${httpMethod}('/${newMethod}')
    @response(200, {
      description: '${modelName} custom model instance',
      content: {'application/json': {schema: getModelSchemaRef(${modelName})}},
    })
    async ${queryMethod}(@param.filter(${modelName}) filter?: Filter<${modelName}>): Promise<${modelName}[]> {
      return this.${lowerCase(modelName)}.execute('${sqlQuery}');
    }
  `;
  const controller = `
  ${imports}
  export class ${modelName}Controller {
    ${constructor}

    ${customRoute}
  }`;
  console.log(controller);
})();

*/
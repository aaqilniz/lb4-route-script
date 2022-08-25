
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
      query = argument.length > 1 ? argument[1] : true;
    }
  });
  return query.replaceAll('eq', '=');
}

(async () => {
  const query = getQuery();
  const parts = query.split('|');
  const modelName = capitalize(parts[0]);
  const existingRepo = parts[1];
  const httpMethod = parts[2];
  const newMethod = parts[3];
  const params = parts[4].split(',') || [];
  const inputParams = {};
  let queryMethod = '';
  switch (httpMethod) {
    case 'get': queryMethod = 'find'
      break;
    case 'post': queryMethod = 'create'
      break;
  }
  params.forEach(param => {
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
  const imports = ``;
  const constructor = `constructor() {}`;
  const customRoute = `${httpMethod}('/${newMethod}')
    @response(200, {
    description: '${modelName} custom model instance',
    content: {'application/json': {schema: getModelSchemaRef(${modelName})}},
    })

    async ${queryMethod}(@param.filter(${modelName}) filter?: Filter<Todo>): Promise<${modelName}[]> {
      return this.${parts[0]}Repository.execute('${sqlQuery}');
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



function capitalize(s) {
  return s[0].toUpperCase() + s.slice(1);
}
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

exports.handler = async (event, context) => {
  console.log("Received event:", JSON.stringify(event, null, 2));

  if (event.queryStringParameters.wait) {
    await sleep(parseInt(event.queryStringParameters.wait));
  }

  if (event.queryStringParameters.error) {
    throw new Error("forced error");
  }

  return {
    statusCode: event.queryStringParameters.statusCode
      ? parseInt(event.queryStringParameters.statusCode)
      : 200,
    headers: { "Content-Type": "text/plain" },
    body: `${process.env.MESSAGE}! You've hit ${event.path}\n`,
  };
};

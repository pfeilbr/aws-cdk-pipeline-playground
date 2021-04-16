const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

exports.handler = async (event, context) => {
  console.log("Received event:", JSON.stringify(event, null, 2));

  const q = event.queryStringParameters;
  if (q && q.wait) {
    await sleep(parseInt(q.wait));
  }

  if (q && q.error) {
    throw new Error("forced error");
  }

  const response = {
    statusCode: q && q.statusCode ? parseInt(q.statusCode) : 200,
    headers: { "Content-Type": "text/plain" },
    body: `${process.env.MESSAGE}! You've hit ${event.path}\n`,
  };

  console.log("response:", JSON.stringify(response, null, 2));

  return response;
};

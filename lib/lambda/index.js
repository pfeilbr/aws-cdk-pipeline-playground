exports.handler = async (event, context) => {
  console.log("Received event:", JSON.stringify(event, null, 2));
  return {
    statusCode: 200,
    headers: { "Content-Type": "text/plain" },
    body: `${process.env.MESSAGE}! You've hit ${event.path}\n`,
  };
};

import AWS from "aws-sdk";
const getSecrets = async () => {
  // 🚀 Production — fetch from AWS Secrets Manager
  const client = new AWS.SecretsManager({
    region: "ap-south-1",
  });

  try {
    const data = await client
      .getSecretValue({
        SecretId: "remote-collab/backend",
      })
      .promise();

    if (!data.SecretString) {
      throw new Error("No secret string found");
    }

    const secrets = JSON.parse(data.SecretString);

    Object.keys(secrets).forEach((key) => {
      process.env[key] = secrets[key];
    });

    console.log("✅ Secrets loaded from AWS");
  } catch (err) {
    console.error("❌ Error fetching secrets:", err);
    process.exit(1);
  }
};

export default getSecrets;
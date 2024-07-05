const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.sendNotification = functions.https.onCall(async (data, context) => {
  const title = data.title;
  const body = data.body;

  const tokensSnapshot = await admin.firestore().collection("tokens").get();
  const tokens = tokensSnapshot.docs.map((doc) => doc.data().token);

  if (tokens.length > 0) {
    const message = {
      notification: {
        title: title,
        body: body,
      },
      tokens: tokens,
    };

    const response = await admin.messaging().sendEachForMulticast(message);
    return {successCount: response.successCount};
  } else {
    throw new functions.https.HttpsError("failed-precondition",
        "No tokens available");
  }
});

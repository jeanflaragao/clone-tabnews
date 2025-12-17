import retry from "async-retry";

async function waitForAllServices() {
  await waitForWebServer();

  function waitForWebServer() {
    return retry(fetchStatusPage, {
      retries: 100,
      maxTimeout: 1000,
    });

    async function fetchStatusPage(bail, tryNumber) {
      const response = await fetch("http://localhost:3000/api/v1/status");
      if (response.status !== 200) {
        throw new Error("Web server is not ready yet");
      }
    }
  }
}

export default {
  waitForAllServices,
};

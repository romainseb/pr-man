import configurations from "./configurations";
import { getPrsFromRepository } from "./github";
import { sendPrsToSlack } from "./slack";

configurations.forEach(configuration => {
  Promise.all(
    configuration.repositories.map(repository =>
      getPrsFromRepository(repository, configuration.users)
    )
  ).then(values => {
    sendPrsToSlack(values, configuration);
  });
});

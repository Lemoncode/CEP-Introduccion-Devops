FROM jenkins/jenkins:lts-jdk21

USER root

# Install docker-cli
RUN apt-get update && apt-get install -y lsb-release zip \
  && curl -fsSLo /etc/apt/keyrings/docker-archive-keyring.asc https://download.docker.com/linux/debian/gpg \
  && echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker-archive-keyring.asc] https://download.docker.com/linux/debian $(lsb_release -cs) stable" > /etc/apt/sources.list.d/docker.list \
  && apt-get update && apt-get install -y docker-ce-cli

# Install docker-compose
RUN curl -fsL https://api.github.com/repos/docker/compose/releases/latest | grep tag_name | cut -d '"' -f 4 | tee /tmp/compose-version  \
  && mkdir -p /usr/lib/docker/cli-plugins  \
  && curl -fsSLo /usr/lib/docker/cli-plugins/docker-compose https://github.com/docker/compose/releases/download/$(cat /tmp/compose-version)/docker-compose-$(uname -s)-$(uname -m)  \
  && chmod +x /usr/lib/docker/cli-plugins/docker-compose  \
  && ln -s /usr/lib/docker/cli-plugins/docker-compose /usr/bin/docker-compose  \
  && rm /tmp/compose-version

# Install NodeJS
RUN apt-get update \
  && apt-get install -y ca-certificates curl gnupg \
  && curl -fsSL https://deb.nodesource.com/setup_lts.x | bash -  \
  && apt-get install -y nodejs

USER jenkins

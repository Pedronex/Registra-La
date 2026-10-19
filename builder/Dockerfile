FROM eclipse-temurin:21-jdk

# Versões exigidas pelo React Native 0.88 / Expo SDK 58
ARG NODE_VERSION=22.17.1
ARG ANDROID_CMDLINE_TOOLS=11076708
ARG ANDROID_PLATFORM=37
ARG ANDROID_BUILD_TOOLS=37.0.0
ARG ANDROID_NDK=27.1.12297006
ARG ANDROID_CMAKE=3.22.1

ENV ANDROID_HOME=/opt/android-sdk
ENV ANDROID_SDK_ROOT=${ANDROID_HOME}
ENV PATH=${PATH}:/opt/node/bin:${ANDROID_HOME}/cmdline-tools/latest/bin:${ANDROID_HOME}/platform-tools

RUN apt-get update \
    && apt-get install -y --no-install-recommends curl unzip git rsync xz-utils ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Node.js
RUN mkdir -p /opt/node \
    && curl -fsSL "https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-linux-x64.tar.xz" \
       | tar -xJ -C /opt/node --strip-components=1 \
    && npm install -g bun

# Android SDK
RUN mkdir -p ${ANDROID_HOME}/cmdline-tools \
    && curl -fsSL -o /tmp/tools.zip "https://dl.google.com/android/repository/commandlinetools-linux-${ANDROID_CMDLINE_TOOLS}_latest.zip" \
    && unzip -q /tmp/tools.zip -d ${ANDROID_HOME}/cmdline-tools \
    && mv ${ANDROID_HOME}/cmdline-tools/cmdline-tools ${ANDROID_HOME}/cmdline-tools/latest \
    && rm /tmp/tools.zip \
    && yes | sdkmanager --licenses > /dev/null \
    && sdkmanager "platform-tools" "platforms;android-${ANDROID_PLATFORM}" \
       "build-tools;${ANDROID_BUILD_TOOLS}" "ndk;${ANDROID_NDK}" "cmake;${ANDROID_CMAKE}"

COPY build.sh /usr/local/bin/build-app
RUN sed -i 's/\r$//' /usr/local/bin/build-app && chmod +x /usr/local/bin/build-app

WORKDIR /work
CMD ["build-app"]

#!/usr/bin/env bash
# Gera o APK Android localmente, sem EAS/Expo.
#   BUILD_TYPE=release|debug   (padrão: release)
#   APP_VARIANT=development|preview|production   (padrão: preview)
# Fonte montada em /src (somente leitura); o APK sai em /out.
set -euo pipefail

BUILD_TYPE="${BUILD_TYPE:-release}"
export APP_VARIANT="${APP_VARIANT:-preview}"
TASK="assemble$(echo "${BUILD_TYPE:0:1}" | tr a-z A-Z)${BUILD_TYPE:1}"

echo ">> Copiando fonte (variant=${APP_VARIANT}, tipo=${BUILD_TYPE})"
rsync -a --delete \
  --exclude node_modules --exclude android --exclude ios --exclude .git \
  --exclude .expo --exclude builder/out /src/ /work/

cd /work
bun install --frozen-lockfile

echo ">> Gerando projeto nativo (expo prebuild)"
npx expo prebuild --platform android --no-install --clean

cd android
echo ">> Compilando (${TASK})"
./gradlew "${TASK}" --no-daemon -Dorg.gradle.jvmargs="-Xmx4g -XX:MaxMetaspaceSize=1g"

mkdir -p /out
VERSION="$(node -p "require('/work/package.json').version")"
cp app/build/outputs/apk/"${BUILD_TYPE}"/*.apk "/out/registra-la-${VERSION}-${APP_VARIANT}-${BUILD_TYPE}.apk"
echo ">> Pronto:"
ls -lh /out

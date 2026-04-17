#!/bin/bash
set -e -u -o pipefail

# Force Gradle 8.13
sed -i 's|distributionUrl=.*|distributionUrl=https://services.gradle.org/distributions/gradle-8.13-all.zip|' android/gradle/wrapper/gradle-wrapper.properties

# Install node dependencies
npm ci --include=dev

# Replace all Java 17 references with Java 21 in gradle/kotlin files
find . \( -name "*.gradle" -o -name "*.gradle.kts" -o -name "*.kt" \) -print0 2>/dev/null | xargs -0 -r sed -i \
  -e 's/JavaLanguageVersion\.of(17)/JavaLanguageVersion.of(21)/g' \
  -e 's/jvmToolchain(17)/jvmToolchain(21)/g' \
  -e 's/JavaVersion\.VERSION_17/JavaVersion.VERSION_21/g' \
  -e 's/sourceCompatibility *= *17/sourceCompatibility = 21/g' \
  -e 's/targetCompatibility *= *17/targetCompatibility = 21/g' \
  -e 's/languageVersion *= *17/languageVersion = 21/g' \
  -e 's/jvmTarget *= *"17"/jvmTarget = "21"/g' || true

# Extra pass for node_modules
grep -rlE 'languageVersion.*17|jvmToolchain.*17|VERSION_17|JvmLanguageVersion\.of.*17' node_modules/ 2>/dev/null | xargs -r sed -i \
  -e 's/JavaLanguageVersion\.of(17)/JavaLanguageVersion.of(21)/g' \
  -e 's/jvmToolchain(17)/jvmToolchain(21)/g' \
  -e 's/JavaVersion\.VERSION_17/JavaVersion.VERSION_21/g' \
  -e 's/sourceCompatibility *= *17/sourceCompatibility = 21/g' \
  -e 's/targetCompatibility *= *17/targetCompatibility = 21/g' \
  -e 's/languageVersion *= *17/languageVersion = 21/g' || true

# Ensure a newline before appending, then add Java 21 settings
echo >> android/gradle.properties
cat >> android/gradle.properties << 'EOF'
org.gradle.java.home=/usr/lib/jvm/java-21-openjdk-amd64
org.gradle.jvmargs=-Xmx4096m -XX:MaxMetaspaceSize=1024m
android.useAndroidX=true
android.enableJetifier=false
EOF
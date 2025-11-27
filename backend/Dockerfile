FROM maven:3.8-openjdk-17 AS builder
WORKDIR /app
COPY pom.xml ./
RUN mvn dependency:go-offline -B --settings="https://maven.aliyun.com/nexus/content/groups/public/"
COPY src ./src
RUN mvn package -DskipTests

FROM openjdk:17-alpine
WORKDIR /app
COPY --from=builder /app/target/leaf-card-backend.jar ./app.jar
EXPOSE 8080
CMD ["java", "-jar", "app.jar", "--spring.profiles.active=prod"]
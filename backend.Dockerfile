FROM eclipse-temurin:17-jdk AS backend-build

WORKDIR /app/backend

COPY pom.xml ./

RUN apt-get update && apt-get install -y maven

COPY src ./src

RUN mvn package -DskipTests

FROM eclipse-temurin:17-jre

WORKDIR /app

COPY --from=backend-build /app/backend/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
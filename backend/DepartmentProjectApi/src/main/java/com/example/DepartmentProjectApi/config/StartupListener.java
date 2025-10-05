package com.example.DepartmentProjectApi.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

@Component
public class StartupListener implements ApplicationListener<ApplicationReadyEvent> {

    private static final Logger logger = LoggerFactory.getLogger(StartupListener.class);

    @Override
    public void onApplicationEvent(ApplicationReadyEvent event) {
        String port = event.getApplicationContext().getEnvironment().getProperty("server.port");

        logger.info("\n\n=================================================================" +
                    "\n                                                                 " +
                    "\n  Department & Project API is successfully running!              " +
                    "\n                                                                 " +
                    "\n  Local API Base URL: http://localhost:{}/api                     " +
                    "\n  Swagger UI          : http://localhost:{}/swagger-ui.html       " +
                    "\n                                                                 " +
                    "\n=================================================================\n", port, port);
    }
}
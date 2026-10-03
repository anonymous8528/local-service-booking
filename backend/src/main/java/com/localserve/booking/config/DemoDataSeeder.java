package com.localserve.booking.config;

import com.localserve.booking.model.*;
import com.localserve.booking.repository.SlotRepository;
import com.localserve.booking.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Random;

// Creates random demo customers, providers and open slots (only when the DB has no providers).
@Component
@ConditionalOnProperty(name = "app.seed-demo", havingValue = "true")
public class DemoDataSeeder implements CommandLineRunner {
    private final UserRepository users;
    private final SlotRepository slots;
    private final PasswordEncoder encoder;

    public DemoDataSeeder(UserRepository users, SlotRepository slots, PasswordEncoder encoder) {
        this.users = users;
        this.slots = slots;
        this.encoder = encoder;
    }

    private static final String[] FIRST = {"Rahul", "Amit", "Suresh", "Priya", "Neha", "Vikram", "Anjali", "Ravi", "Pooja", "Deepak", "Sunita", "Manoj"};
    private static final String[] LAST = {"Sharma", "Verma", "Singh", "Gupta", "Yadav", "Mishra", "Khan", "Patel", "Chauhan", "Tiwari"};
    private static final String[] CITIES = {"Noida", "Delhi", "Gurgaon", "Lucknow", "Ghaziabad"};
    private static final int[] HOURS = {10, 12, 14, 16, 18};

    @Override
    public void run(String... args) {
        if (users.countByRole(Role.PROVIDER) > 0) return;

        Random rnd = new Random();
        String password = encoder.encode("Test@123");

        // 5 demo customers
        for (int i = 1; i <= 5; i++) {
            User c = new User();
            c.setName(FIRST[rnd.nextInt(FIRST.length)] + " " + LAST[rnd.nextInt(LAST.length)]);
            c.setEmail("customer" + i + "@demo.com");
            c.setPassword(password);
            c.setRole(Role.CUSTOMER);
            users.save(c);
        }

        // 3 providers per category, each with random open slots for the next 7 days
        int n = 1;
        for (Category category : Category.values()) {
            for (int k = 0; k < 3; k++, n++) {
                User p = new User();
                p.setName(FIRST[rnd.nextInt(FIRST.length)] + " " + LAST[rnd.nextInt(LAST.length)]);
                p.setEmail("provider" + n + "@demo.com");
                p.setPassword(password);
                p.setRole(Role.PROVIDER);
                p.setCategory(category);
                p.setCity(CITIES[rnd.nextInt(CITIES.length)]);
                p.setHourlyRate(200.0 + rnd.nextInt(10) * 50);
                p.setBio("Experienced " + category.name().toLowerCase() + " with "
                        + (2 + rnd.nextInt(12)) + " years of work. Punctual and reliable.");
                p = users.save(p);

                for (int day = 1; day <= 7; day++) {
                    for (int hour : HOURS) {
                        if (rnd.nextInt(100) < 60) { // ~60% of hours are open
                            LocalDateTime start = LocalDate.now().plusDays(day).atTime(LocalTime.of(hour, 0));
                            slots.save(new AvailabilitySlot(p, start, start.plusHours(1)));
                        }
                    }
                }
            }
        }
        System.out.println("Demo data created. Logins: customer1@demo.com ... provider1@demo.com ... password Test@123");
    }
}
import datetime
import random
from app.database import engine, Base, SessionLocal
from app import models
from app.security import get_password_hash

def seed_db():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    print("Seeding Users & Demo Accounts...")
    hashed_pass = get_password_hash("password123")
    hashed_admin_pass = get_password_hash("admin123")
    hashed_leader_pass = get_password_hash("leader123")

    users_data = [
        {"email": "admin@example.com", "full_name": "Father Joseph Thomas (Super Admin)", "role": "super_admin", "password_hash": hashed_admin_pass, "phone": "+91 98765-0100", "avatar_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"},
        {"email": "communityadmin@example.com", "full_name": "Sister Maria Rodriguez (Parish Admin)", "role": "parish_admin", "password_hash": hashed_admin_pass, "phone": "+91 98765-0101", "avatar_url": "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150"},
        {"email": "leader@example.com", "full_name": "David Chen (Youth Committee Leader)", "role": "committee_leader", "password_hash": hashed_leader_pass, "phone": "+91 98765-0102", "avatar_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"},
        {"email": "volunteer@example.com", "full_name": "Grace Okonjo (Lead Volunteer)", "role": "volunteer", "password_hash": get_password_hash("volunteer123"), "phone": "+91 98765-0103", "avatar_url": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150"},
        {"email": "member@example.com", "full_name": "Robert Taylor (Parish Member)", "role": "member", "password_hash": get_password_hash("member123"), "phone": "+91 98765-0104", "avatar_url": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150"},
        {"email": "viewer@example.com", "full_name": "Elena Rostova (Auditor / Viewer)", "role": "viewer", "password_hash": hashed_pass, "phone": "+91 98765-0105", "avatar_url": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150"},
    ]

    users_map = {}
    for u in users_data:
        usr = models.User(**u)
        db.add(usr)
        db.commit()
        db.refresh(usr)
        users_map[u["role"]] = usr

    print("Seeding Families...")
    family_names = [
        ("The Taylor Family", "Robert Taylor", "104 Parish Way, St. Jude Quarter", "+91 98765-0201"),
        ("The Chen Family", "David Chen", "215 Grace Avenue", "+91 98765-0202"),
        ("The Rodriguez Family", "Carlos Rodriguez", "88 Faith Blvd", "+91 98765-0203"),
        ("The Okonjo Family", "Grace Okonjo", "14 Harvest Lane", "+91 98765-0204"),
        ("The Kowalski Family", "Jan Kowalski", "502 Hope Street", "+91 98765-0205"),
        ("The Patel Family", "Aarav Patel", "77 Unity Circle", "+91 98765-0206"),
        ("The Dubois Family", "Jean-Luc Dubois", "310 Trinity Drive", "+91 98765-0207"),
        ("The Santos Family", "Sofia Santos", "94 St. Michael Rd", "+91 98765-0208"),
        ("The O'Connor Family", "Liam O'Connor", "118 Mercy Heights", "+91 98765-0209"),
        ("The Tanaka Family", "Kenji Tanaka", "405 Harmony Square", "+91 98765-0210"),
    ]

    families = []
    for fname, pcontact, addr, ph in family_names:
        fam = models.Family(
            name=fname,
            primary_contact=pcontact,
            address=addr,
            phone=ph,
            emergency_contact=ph,
            notes="Active parish family in good standing."
        )
        db.add(fam)
        db.commit()
        db.refresh(fam)
        families.append(fam)

    print("Seeding Members (32 members)...")
    member_names = [
        ("Robert", "Taylor", "robert.taylor@example.com", "+91 98765-0301", "1982-04-12", "Male", families[0].id, "active"),
        ("Sarah", "Taylor", "sarah.taylor@example.com", "+91 98765-0302", "1985-09-23", "Female", families[0].id, "active"),
        ("Lucas", "Taylor", "lucas.taylor@example.com", "+91 98765-0303", "2010-11-05", "Male", families[0].id, "active"),
        ("David", "Chen", "david.chen@example.com", "+91 98765-0304", "1988-06-18", "Male", families[1].id, "active"),
        ("Emily", "Chen", "emily.chen@example.com", "+91 98765-0305", "1990-01-30", "Female", families[1].id, "active"),
        ("Carlos", "Rodriguez", "carlos.r@example.com", "+91 98765-0306", "1975-03-14", "Male", families[2].id, "active"),
        ("Isabella", "Rodriguez", "isa.r@example.com", "+91 98765-0307", "1978-08-09", "Female", families[2].id, "active"),
        ("Grace", "Okonjo", "grace.okonjo@example.com", "+91 98765-0308", "1992-12-04", "Female", families[3].id, "active"),
        ("Samuel", "Okonjo", "samuel.o@example.com", "+91 98765-0309", "1991-05-19", "Male", families[3].id, "active"),
        ("Jan", "Kowalski", "jan.k@example.com", "+91 98765-0310", "1965-07-22", "Male", families[4].id, "active"),
        ("Anna", "Kowalski", "anna.k@example.com", "+91 98765-0311", "1968-10-15", "Female", families[4].id, "active"),
        ("Aarav", "Patel", "aarav.patel@example.com", "+91 98765-0312", "1984-02-28", "Male", families[5].id, "active"),
        ("Priya", "Patel", "priya.patel@example.com", "+91 98765-0313", "1986-11-11", "Female", families[5].id, "active"),
        ("Jean-Luc", "Dubois", "jl.dubois@example.com", "+91 98765-0314", "1979-09-03", "Male", families[6].id, "active"),
        ("Claire", "Dubois", "claire.d@example.com", "+91 98765-0315", "1981-04-25", "Female", families[6].id, "active"),
        ("Sofia", "Santos", "sofia.santos@example.com", "+91 98765-0316", "1995-03-17", "Female", families[7].id, "active"),
        ("Mateo", "Santos", "mateo.s@example.com", "+91 98765-0317", "1993-08-30", "Male", families[7].id, "active"),
        ("Liam", "O'Connor", "liam.oc@example.com", "+91 98765-0318", "1972-01-14", "Male", families[8].id, "active"),
        ("Siobhan", "O'Connor", "siobhan.oc@example.com", "+91 98765-0319", "1974-06-27", "Female", families[8].id, "active"),
        ("Kenji", "Tanaka", "kenji.t@example.com", "+91 98765-0320", "1983-12-10", "Male", families[9].id, "active"),
        ("Hana", "Tanaka", "hana.t@example.com", "+91 98765-0321", "1985-05-04", "Female", families[9].id, "active"),
        ("Marcus", "Vance", "marcus.vance@example.com", "+91 98765-0322", "1996-07-08", "Male", None, "active"),
        ("Hannah", "Abbott", "hannah.a@example.com", "+91 98765-0323", "1998-02-14", "Female", None, "active"),
        ("Benjamin", "Wright", "ben.wright@example.com", "+91 98765-0324", "1970-11-20", "Male", None, "active"),
        ("Chloe", "Bennett", "chloe.b@example.com", "+91 98765-0325", "2001-09-09", "Female", None, "active"),
        ("Daniel", "Kim", "daniel.kim@example.com", "+91 98765-0326", "1989-10-31", "Male", None, "active"),
        ("Rachel", "Green", "rachel.g@example.com", "+91 98765-0327", "1994-03-03", "Female", None, "active"),
        ("Gabriel", "Silva", "gabriel.silva@example.com", "+91 98765-0328", "1987-12-24", "Male", None, "active"),
        ("Naomi", "Foster", "naomi.f@example.com", "+91 98765-0329", "1991-08-16", "Female", None, "active"),
        ("Thomas", "Brodie", "thomas.b@example.com", "+91 98765-0330", "1960-05-05", "Male", None, "active"),
        ("Elizabeth", "Warren", "elizabeth.w@example.com", "+91 98765-0331", "1958-01-19", "Female", None, "active"),
        ("Jonathan", "Miller", "j.miller@example.com", "+91 98765-0332", "2003-04-30", "Male", None, "active"),
    ]

    members = []
    for idx, m in enumerate(member_names):
        uid = users_map["member"].id if m[0] == "Robert" and m[1] == "Taylor" else (users_map["volunteer"].id if m[0] == "Grace" and m[1] == "Okonjo" else None)
        mem = models.Member(
            user_id=uid,
            first_name=m[0],
            last_name=m[1],
            email=m[2],
            phone=m[3],
            address=f"{100 + idx} Parish Street, Zone {idx % 4 + 1}",
            date_of_birth=m[4],
            gender=m[5],
            family_id=m[6],
            membership_status=m[7],
            emergency_contact="+91 98765-9999",
            joined_date=f"202{random.randint(1,5)}-0{random.randint(1,9)}-15",
            bio=f"Active member participating in parish outreach and community initiatives."
        )
        db.add(mem)
        db.commit()
        db.refresh(mem)
        members.append(mem)

    print("Seeding Committees...")
    committees_data = [
        ("Youth Committee", "Empowering young parishioners through mentorship, sports, and spiritual retreats.", "David Chen", "Youth", "Increase youth involvement by 35% in 2026"),
        ("Education & Literacy Committee", "Providing free tutoring, adult literacy, and scholarship management.", "Sarah Taylor", "Education", "Reach 200 students with after-school tutoring"),
        ("Welfare & Community Care Committee", "Managing food drives, emergency financial relief, and elderly care.", "Carlos Rodriguez", "Welfare", "Ensure zero parish families go hungry during emergencies"),
        ("Healthcare & Wellness Committee", "Organizing free medical checkup camps, blood drives, and mental wellness workshops.", "Dr. Priya Patel", "Healthcare", "Conduct 4 comprehensive health clinics annually"),
        ("Women Development & Support", "Skills training, micro-grants, and support groups for women in community.", "Grace Okonjo", "Development", "Train 50 women in vocational skills per semester"),
        ("Events & Cultural Committee", "Planning parish feasts, community gatherings, and inter-faith dialogues.", "Liam O'Connor", "Cultural", "Host 12 major community celebration events"),
        ("Finance & Stewardship Committee", "Overseeing parish budgeting, transparent fundraising, and audit compliance.", "Father Joseph Thomas", "Finance", "Maintain 100% financial transparency and audit readiness"),
    ]

    committees = []
    for cname, cdesc, cleader, ccat, cgoals in committees_data:
        com = models.Committee(
            name=cname,
            description=cdesc,
            leader_name=cleader,
            category=ccat,
            goals=cgoals
        )
        db.add(com)
        db.commit()
        db.refresh(com)
        committees.append(com)

    print("Seeding Volunteers (16 volunteers)...")
    volunteers_data = [
        (members[7].id, "First Aid, Logistics, Counseling", "Weekends", "Healthcare, Youth", "Healthcare & Wellness Committee", "Gold Badge", 120.5),
        (members[3].id, "Youth Leadership, Event Setup", "Saturdays", "Youth, Sports", "Youth Committee", "Silver Star", 85.0),
        (members[1].id, "Tutoring, Curriculum Design", "Tuesdays & Thursdays", "Education", "Education & Literacy Committee", "Silver Star", 64.0),
        (members[5].id, "Food Distribution, Driving", "Weekdays", "Welfare, Logistics", "Welfare & Community Care Committee", "Gold Badge", 142.0),
        (members[12].id, "Medical Screening, Health Talks", "Monthly Camps", "Healthcare", "Healthcare & Wellness Committee", "Gold Badge", 98.0),
        (members[15].id, "Social Media, Photography", "Flexible", "Media, Communications", "Events & Cultural Committee", "Bronze Star", 42.5),
        (members[16].id, "Audio/Visual, Sound Eng", "Sundays", "Technology", "Events & Cultural Committee", "Bronze Star", 35.0),
        (members[21].id, "Sports Coaching, Refereeing", "Weekends", "Youth, Fitness", "Youth Committee", "Silver Star", 78.0),
        (members[22].id, "Administrative, Filing", "Mon-Wed Morning", "Admin", "Finance & Stewardship Committee", "Silver Star", 55.0),
        (members[23].id, "Elderly Companionship, Meals", "Fridays", "Welfare, Elderly Care", "Welfare & Community Care Committee", "Gold Badge", 110.0),
        (members[24].id, "Graphic Design, Posters", "Remote", "Design, Media", "Events & Cultural Committee", "Bronze Star", 28.0),
        (members[25].id, "Translation (Spanish/English)", "On Call", "Language, Support", "Welfare & Community Care Committee", "Silver Star", 50.0),
        (members[26].id, "IT Support, Web Maintenance", "Flexible", "Technology", "Finance & Stewardship Committee", "Silver Star", 62.0),
        (members[27].id, "Counseling Support, Intake", "Wednesdays", "Mental Health", "Women Development & Support", "Gold Badge", 92.0),
        (members[28].id, "Maintenance, Carpentry", "Saturdays", "Facilities", "Events & Cultural Committee", "Silver Star", 70.0),
        (members[29].id, "Choir Direction, Music", "Sun/Wed", "Music", "Events & Cultural Committee", "Gold Badge", 135.0),
    ]

    volunteers = []
    for mid, sk, av, intst, ccomm, rlevel, thours in volunteers_data:
        vol = models.Volunteer(
            member_id=mid,
            skills=sk,
            availability=av,
            interests=intst,
            committee_name=ccomm,
            status="Active",
            total_hours=thours,
            recognition_level=rlevel,
            emergency_contact="+91 98765-8888"
        )
        db.add(vol)
        db.commit()
        db.refresh(vol)
        volunteers.append(vol)

    print("Seeding Community Services (10 services)...")
    services_data = [
        ("Youth Literacy & Homework Hub", "Education", "Free after-school tutoring for K-12 students with volunteer mentors.", "Open to all school-age parish children", "Sarah Taylor", "Parish Education Center", "Mon-Thu 3:30 PM - 5:30 PM", 60, "Student ID, Parent Consent"),
        ("Free Community Health & BP Clinic", "Healthcare", "Bi-weekly health checkups, blood pressure monitoring, and diabetes screening.", "Open to all residents & senior citizens", "Dr. Priya Patel", "Parish Wellness Hall", "1st & 3rd Saturday 9 AM - 1 PM", 100, "None"),
        ("Emergency Family Food Basket Program", "Welfare", "Nutritious food assistance boxes delivered to families experiencing emergency hardship.", "Income verified or emergency referral", "Carlos Rodriguez", "Welfare Pantry", "Fridays 10 AM - 4 PM", 80, "Proof of residence"),
        ("Confidential Family & Grief Counseling", "Counselling", "Professional and spiritual counseling for families, individuals, and grieving members.", "By appointment", "Fr. Joseph Thomas / Sister Maria", "Pastoral Care Office", "Tue & Thu 1 PM - 6 PM", 25, "Intake Form"),
        ("Women Vocational Skills Academy", "Family Support", "Practical courses in tailoring, culinary arts, digital literacy, and micro-business creation.", "Open to all women in community", "Grace Okonjo", "Community Skills Lab", "Mon & Wed 10 AM - 12 PM", 40, "Registration Form"),
        ("Senior Citizen Wellness & Social Circle", "Welfare", "Weekly social gathering, chair yoga, warm meals, and health check-ins for seniors.", "Ages 60+", "Jan Kowalski", "St. Jude Hall", "Wednesdays 10 AM - 2 PM", 50, "Emergency Contact"),
        ("Youth Leadership & Tech Apprenticeship", "Youth Programs", "Coding bootcamps, public speaking workshops, and community service projects for teens.", "Teens 13-19", "David Chen", "Innovation Room B", "Saturdays 2 PM - 5 PM", 30, "Parent Consent"),
        ("Emergency Financial Hardship Relief", "Emergency Assistance", "One-time micro-grants for utility bills, medical emergencies, or sudden job loss.", "Subject to welfare committee evaluation", "Finance Secretariat", "Admin Office", "By Appointment", 20, "Utility Bill, Income Proof"),
        ("New Immigrant & Language Support", "Family Support", "English as Second Language (ESL) classes and legal document aid for newly arrived families.", "All immigrant & refugee families", "Sofia Santos", "Room 102", "Tue & Fri 6 PM - 8 PM", 45, "None"),
        ("Substance Abuse & Recovery Support Group", "Counselling", "Peer-led 12-step recovery program with compassionate spiritual guidance.", "Anyone seeking addiction recovery", "Robert Taylor", "Pastoral Room C", "Mondays 7 PM - 8:30 PM", 30, "Confidentiality Agreement"),
    ]

    services = []
    for sname, scat, sdesc, selig, scontact, sloc, ssch, scap, sdocs in services_data:
        srv = models.Service(
            name=sname,
            category=scat,
            description=sdesc,
            eligibility=selig,
            contact_person=scontact,
            location=sloc,
            schedule=ssch,
            capacity=scap,
            status="Active",
            required_documents=sdocs
        )
        db.add(srv)
        db.commit()
        db.refresh(srv)
        services.append(srv)

    print("Seeding Service Requests (22 requests)...")
    statuses = ["Submitted", "Under Review", "Approved", "In Progress", "Completed", "Completed"]
    priorities = ["Low", "Medium", "High", "Critical"]
    service_requests = []
    for i in range(22):
        s_obj = services[i % len(services)]
        m_obj = members[i % len(members)]
        sr = models.ServiceRequest(
            request_number=f"SR-2026-{1001 + i}",
            service_id=s_obj.id,
            member_id=m_obj.id,
            member_name=f"{m_obj.first_name} {m_obj.last_name}",
            service_name=s_obj.name,
            status=statuses[i % len(statuses)],
            priority=priorities[i % len(priorities)],
            details=f"Request submitted for {s_obj.name} to assist family with immediate needs.",
            notes="Processed by welfare administration team."
        )
        db.add(sr)
        db.commit()
        db.refresh(sr)
        service_requests.append(sr)

    print("Seeding Support Cases (12 confidential cases)...")
    case_cats = ["Food & Basic Needs", "Healthcare Relief", "Financial Aid", "Housing Support", "Family Crisis"]
    case_titles = [
        "Medical Bill Relief for Post-Surgery Care",
        "Emergency Grocery Supply during Unemployment",
        "Utility Eviction Notice Prevention Support",
        "Educational Scholarship for High School Senior",
        "Elderly Home Care Logistics & Meal Aid",
        "Single Mother Temporary Rent Assistance",
        "Fire Damage Emergency Household Relief",
        "Disability Appliance Assistance Grant",
        "Childcare Support for Working Parent",
        "Prescription Medication Micro-Grant",
        "Winter Clothing & Bedding Distribution",
        "Bereavement Family Financial Assistance"
    ]

    support_cases = []
    for i in range(12):
        m_obj = members[(i * 2) % len(members)]
        sc = models.SupportCase(
            case_number=f"CASE-2026-{501 + i}",
            member_id=m_obj.id,
            member_name=f"{m_obj.first_name} {m_obj.last_name}",
            category=case_cats[i % len(case_cats)],
            priority=["High", "Critical", "Medium", "Medium"][i % 4],
            title=case_titles[i],
            description=f"Confidential support case initiated for {m_obj.first_name} {m_obj.last_name} regarding urgent community assistance.",
            assigned_staff="Sister Maria Rodriguez",
            status=["In Progress", "Under Review", "Approved", "Resolved"][i % 4],
            created_date=f"2026-09-0{i % 8 + 1}",
            follow_up_date="2026-10-05",
            assistance_provided="Food packages provided; ₹25,000 utility grant approved by committee.",
            notes="Sensitive record - restricted access."
        )
        db.add(sc)
        db.commit()
        db.refresh(sc)
        support_cases.append(sc)

        # Add case notes
        note = models.CaseNote(
            case_id=sc.id,
            author_name="Sister Maria Rodriguez",
            note=f"Initial assessment completed. Verified documentation for {case_titles[i]}.",
            is_private=True
        )
        db.add(note)
        db.commit()

    print("Seeding Events (15 events)...")
    events_data = [
        ("Annual Parish Community Festival & Feast", "Community", "St. Jude Open Grounds", "2026-10-15 10:00", "2026-10-15 20:00", "Events Committee", 500, "Registration Open", "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=500"),
        ("Youth Hackathon for Social Good", "Youth", "Innovation Center", "2026-10-20 09:00", "2026-10-20 18:00", "Youth Committee", 80, "Registration Open", "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=500"),
        ("Grand Free Health & Dental Camp", "Healthcare", "Wellness Hall", "2026-10-08 08:30", "2026-10-08 16:00", "Healthcare Committee", 250, "Registration Open", "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=500"),
        ("Harvest Season Charity Dinner & Gala", "Fundraising", "Grand Ballroom", "2026-11-05 18:30", "2026-11-05 22:00", "Finance Committee", 150, "Registration Open", "https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=500"),
        ("Parish Clean-up & Tree Planting Drive", "Volunteer", "Parish Park & Surrounding Streets", "2026-10-01 08:00", "2026-10-01 12:00", "Welfare Committee", 120, "Completed", "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=500"),
        ("Senior Citizens High Tea & Musical Concert", "Community", "Fellowship Lounge", "2026-10-12 14:00", "2026-10-12 17:00", "Women Committee", 60, "Registration Open", "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500"),
        ("Financial Literacy & Small Business Workshop", "Education", "Education Room A", "2026-10-25 18:00", "2026-10-25 20:00", "Education Committee", 45, "Registration Open", "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500"),
        ("Youth Retreat: Faith, Leadership & Purpose", "Youth", "Pine Valley Camp Grounds", "2026-11-12 08:00", "2026-11-14 17:00", "Youth Committee", 60, "Published", "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=500"),
        ("Inter-Faith Peace & Community Dialogue", "Cultural", "Main Auditorium", "2026-11-20 17:00", "2026-11-20 20:00", "Pastoral Council", 200, "Published", "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=500"),
        ("Winter Warmth Blanket & Coat Drive", "Welfare", "Parish Courtyard", "2026-11-28 09:00", "2026-11-28 15:00", "Welfare Committee", 300, "Published", "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=500"),
        ("Parish Choir Christmas Carol Auditions", "Cultural", "Music Ministry Room", "2026-10-30 16:00", "2026-10-30 19:00", "Music Ministry", 40, "Registration Open", "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500"),
        ("Parenting in the Digital Age Symposium", "Family Support", "Lecture Hall B", "2026-10-18 10:00", "2026-10-18 13:00", "Family Life Ministry", 90, "Registration Open", "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=500"),
        ("Blood Donation & Marrow Registry Camp", "Healthcare", "Parish Health Wing", "2026-11-01 09:00", "2026-11-01 16:00", "Red Cross & Parish Health", 150, "Published", "https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=500"),
        ("Parish Basketball & Volleyball Tournament", "Youth", "Parish Sports Complex", "2026-12-05 09:00", "2026-12-06 18:00", "Youth Committee", 120, "Draft", "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=500"),
        ("New Year Community Thanksgiving Dinner", "Community", "Parish Hall", "2026-12-31 19:00", "2027-01-01 01:00", "Parish Council", 400, "Draft", "https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=500"),
    ]

    events = []
    for ename, ecat, eloc, stime, etime, eorg, ecap, estatus, eimg in events_data:
        ev = models.Event(
            name=ename,
            category=ecat,
            location=eloc,
            start_time=stime,
            end_time=etime,
            organizer=eorg,
            capacity=ecap,
            registered_count=random.randint(15, min(ecap, 80)),
            registration_deadline=stime.split(" ")[0],
            status=estatus,
            image_url=eimg,
            description=f"Join us for {ename}. All parish members and community guests are warmly welcome!"
        )
        db.add(ev)
        db.commit()
        db.refresh(ev)
        events.append(ev)

    print("Seeding Event Registrations...")
    for i in range(35):
        ev_obj = events[i % len(events)]
        m_obj = members[i % len(members)]
        reg = models.EventRegistration(
            event_id=ev_obj.id,
            member_id=m_obj.id,
            member_name=f"{m_obj.first_name} {m_obj.last_name}",
            email=m_obj.email,
            registration_date=f"2026-09-{random.randint(10,24)}",
            status="Registered"
        )
        db.add(reg)
        db.commit()

    print("Seeding Announcements (10 announcements)...")
    announcements_data = [
        ("Welcome to the New My Parish My Proud Platform!", "We are thrilled to launch our new digital community hub for seamless member care, volunteer activities, and parish news.", "General", "Everyone", "High"),
        ("Registration Open: Annual Community Health Camp", "Free health checkups, vision tests, and consultations will be available on October 8th. Please pre-register early.", "Healthcare", "Everyone", "High"),
        ("Youth Committee Monthly Meeting & Strategy Session", "All youth members and volunteers are invited to assemble in Innovation Room B this Saturday at 2 PM.", "Youth", "Youth", "Normal"),
        ("Emergency Food Drive: Thanksgiving Season Outreach", "We are collecting non-perishable grains, canned soups, and baby food for our emergency welfare pantry.", "Welfare", "Everyone", "Urgent"),
        ("Volunteer Appreciation Breakfast & Medals Ceremony", "Celebrating our dedicated volunteers! Join us on Sunday morning after service for coffee, breakfast, and recognition.", "Volunteers", "Volunteers", "Normal"),
        ("Education Committee: Call for Volunteer Tutors", "We require volunteer tutors in Math, Science, and English for K-12 students starting next month.", "Education", "Members", "Normal"),
        ("Senior Citizens Cultural Excursion Registration", "Bus trip to the Botanical Gardens scheduled for October 12th. Limited seats available for seniors 60+.", "Welfare", "Members", "Normal"),
        ("Financial Transparency Report 2026 Q3 Available", "The quarterly financial report and audit summary are now published in the Documents library.", "Finance", "Everyone", "Normal"),
        ("New Family Support Counseling Schedule Announced", "Sister Maria and pastoral counselors are offering extended evening appointments starting Tuesday.", "Counselling", "Families", "Normal"),
        ("Parish Clean-up Drive Accomplishment Report", "Over 120 volunteers collected 450kg of recyclables and planted 50 native shade trees. Thank you!", "Community", "Everyone", "Low"),
    ]

    for atitle, acontent, acat, aaud, aprio in announcements_data:
        anc = models.Announcement(
            title=atitle,
            content=acontent,
            category=acat,
            audience=aaud,
            priority=aprio,
            status="Published",
            publish_date="2026-09-20",
            expiry_date="2026-10-31",
            author_name="Sister Maria Rodriguez"
        )
        db.add(anc)
        db.commit()

    print("Seeding Fundraising Campaigns (5 campaigns)...")
    campaigns_data = [
        ("St. Jude Community Healthcare Wing Expansion", "Raising funds for 3 new medical consultation rooms and diagnostic equipment.", 150000.0, 94500.0, "2026-08-01", "2026-11-30", "Active"),
        ("Emergency Welfare & Winter Blanket Fund", "Providing direct emergency micro-grants and warm clothing to vulnerable families.", 25000.0, 19800.0, "2026-09-01", "2026-10-31", "Active"),
        ("Youth Education & Laptop Scholarship Drive", "Sponsoring 30 refurbished laptops and academic scholarships for underprivileged teens.", 35000.0, 28000.0, "2026-07-15", "2026-10-15", "Active"),
        ("Parish Solar Energy & Eco-Sustainability Project", "Installing rooftop solar panels to reduce parish carbon footprint and utility bills.", 60000.0, 42000.0, "2026-06-01", "2026-12-15", "Active"),
        ("New Immigrant Welcome & Resettlement Package", "Initial housing starter kits, food parcels, and language books for immigrant families.", 15000.0, 15000.0, "2026-05-01", "2026-08-31", "Completed"),
    ]

    campaigns = []
    for ctitle, cdesc, cgoal, craised, sdate, edate, cstat in campaigns_data:
        cmp = models.Campaign(
            title=ctitle,
            description=cdesc,
            goal_amount=cgoal,
            raised_amount=craised,
            start_date=sdate,
            end_date=edate,
            status=cstat,
            organizer="Parish Stewardship Council"
        )
        db.add(cmp)
        db.commit()
        db.refresh(cmp)
        campaigns.append(cmp)

    print("Seeding Donations (30 donations)...")
    donors = ["Robert Taylor", "Jan Kowalski", "Aarav Patel", "Liam O'Connor", "Dr. Priya Patel", "Jean-Luc Dubois", "Anonymous Benefactor", "Grace Okonjo", "Sofia Santos", "Kenji Tanaka"]
    for i in range(30):
        c_obj = campaigns[i % len(campaigns)]
        amount = float(random.choice([50, 100, 250, 500, 1000, 2500]))
        dnr = random.choice(donors)
        is_anon = (dnr == "Anonymous Benefactor")
        don = models.Donation(
            campaign_id=c_obj.id,
            campaign_name=c_obj.title,
            donor_name=dnr,
            donor_email="donor@example.com" if not is_anon else None,
            amount=amount,
            date=f"2026-09-{random.randint(1,24):02d}",
            payment_status="Completed",
            reference_number=f"TXN-2026-90{100 + i}",
            is_anonymous=is_anon,
            notes="Generous contribution for community development."
        )
        db.add(don)
        db.commit()

    print("Seeding Documents (10 documents)...")
    docs_data = [
        ("Parish Governance & Code of Conduct", "Policies", "/documents/governance_2026.pdf", "2.4 MB", "PDF", "Public", "v2.1"),
        ("Volunteer Onboarding & Safety Manual", "Guidelines", "/documents/volunteer_manual.pdf", "1.8 MB", "PDF", "Public", "v1.4"),
        ("Community Welfare Case Intakes SOP", "Forms", "/documents/welfare_intake_sop.pdf", "850 KB", "PDF", "Members", "v1.0"),
        ("Financial Audit & Stewardship Report Q3 2026", "Reports", "/documents/q3_financial_audit.pdf", "4.1 MB", "PDF", "Public", "v1.0"),
        ("Emergency Assistance Micro-Grant Application", "Forms", "/documents/emergency_grant_app.pdf", "520 KB", "PDF", "Public", "v1.2"),
        ("Youth Protection & Child Safety Framework", "Policies", "/documents/child_safety_policy.pdf", "3.0 MB", "PDF", "Public", "v3.0"),
        ("Healthcare Clinic Volunteer Operating Guidelines", "Guidelines", "/documents/health_clinic_sop.pdf", "1.1 MB", "PDF", "Members", "v1.1"),
        ("Parish Facilities Rental & Usage Policy", "Policies", "/documents/facility_rental_policy.pdf", "1.5 MB", "PDF", "Public", "v1.0"),
        ("Annual Community Impact Assessment 2025-2026", "Reports", "/documents/annual_impact_2026.pdf", "5.8 MB", "PDF", "Public", "v1.0"),
        ("Senior Citizens Program Event Calendar", "Resources", "/documents/seniors_calendar_q4.pdf", "640 KB", "PDF", "Public", "v1.0"),
    ]

    for dtitle, dcat, dpath, dsize, dtype, dacc, dver in docs_data:
        doc = models.Document(
            title=dtitle,
            category=dcat,
            file_path=dpath,
            file_size=dsize,
            file_type=dtype,
            access_level=dacc,
            version=dver,
            description=f"Official parish document: {dtitle}.",
            uploaded_by="Parish Secretariat"
        )
        db.add(doc)
        db.commit()

    print("Seeding Partners (6 partners)...")
    partners_data = [
        ("St. Michael Regional Hospital", "Dr. Anthony Vance", "dr.vance@stmichaelhealth.org", "+91 98765-4001", "Hospital", "Providing mobile diagnostic vans and medical personnel for parish clinics.", "Medical equipment & staff"),
        ("Metro Food Bank Network", "Rachel Green", "rgreen@metrofoodbank.org", "+91 98765-4002", "NGO", "Supplying 2 tons of non-perishable food grains monthly to welfare pantry.", "Food supplies"),
        ("St. Jude Community Academy", "Principal Thomas Brodie", "principal@stjudeacademy.edu", "+91 98765-4003", "School", "Hosting evening literacy classes and providing student volunteers.", "Classroom venue & mentors"),
        ("Apex Digital Solutions", "Jonathan Miller", "jmiller@apexdigital.com", "+91 98765-4004", "Business", "Donating 30 refurbished laptops for the youth apprenticeship program.", "Technology hardware"),
        ("Municipal Social Development Dept", "Elena Rostova", "elena.rostova@citygov.org", "+91 98765-4005", "Government", "Co-funding emergency financial grants and housing placement assistance.", "Government grants"),
        ("Red Cross Regional Chapter", "Marcus Vance", "marcus.v@redcross.org", "+91 98765-4006", "NGO", "Co-organizing quarterly blood drives and emergency disaster preparedness.", "Medical & disaster aid"),
    ]

    for pname, pc, pem, pph, ptype, pdesc, pcontrib in partners_data:
        prt = models.Partner(
            name=pname,
            contact_person=pc,
            email=pem,
            phone=pph,
            partner_type=ptype,
            description=pdesc,
            status="Active",
            contribution_details=pcontrib
        )
        db.add(prt)
        db.commit()

    print("Seeding SOPs (6 SOPs)...")
    sops_data = [
        ("SOP-MEM-001", "Member Registration & Digital Verification", "Member Management", "v1.2", "Secretariat", "1. Member fills online/paper form\n2. Secretariat verifies identity & address\n3. Assign family grouping if applicable\n4. Issue digital parish badge\n5. Trigger welcome email notification."),
        ("SOP-VOL-002", "Volunteer Onboarding & Background Verification", "Volunteer Management", "v2.0", "Volunteer Lead", "1. Application submission & skill profiling\n2. Background check & reference verification\n3. Mandatory Child Safety & Ethics orientation\n4. Assignment to preferred committee\n5. Logging hours and quarterly recognition."),
        ("SOP-WEL-003", "Emergency Welfare Assistance & Confidential Evaluation", "Welfare", "v1.5", "Welfare Committee", "1. Confidential intake request received\n2. Assigned case worker conducts interview within 24h\n3. Urgency categorization (Low/Med/High/Critical)\n4. Welfare committee financial authorization\n5. Disbursement & post-care follow up."),
        ("SOP-EVT-004", "Parish Event Planning & Logistics Approval", "Event Management", "v1.1", "Events Committee", "1. Event proposal submission to Parish Council\n2. Budget & facility reservation approval\n3. Volunteer assignment & security protocol setup\n4. Public publishing & member registration\n5. Post-event attendance audit & cleanup."),
        ("SOP-DON-005", "Donation Handling, Receipting & Transparency Audit", "Finance", "v2.2", "Finance Secretariat", "1. Online or cash donation intake\n2. Immediate automated digital tax receipt generation\n3. Ledger entry in double-entry parish system\n4. Fund allocation strictly to designated campaign\n5. Monthly public financial dashboard update."),
        ("SOP-EMG-006", "Parish Emergency & Crisis Response Protocol", "Emergency Assistance", "v1.0", "Pastoral Council", "1. Immediate activation of Emergency Response Team\n2. Shelter & food center setup in St. Jude Hall\n3. Rapid communication blast via notification engine\n4. Coordination with Red Cross & Municipal services\n5. Ongoing family recovery support tracking."),
    ]

    for scode, stitle, scat, sver, sowner, ssteps in sops_data:
        sop = models.SOP(
            code=scode,
            title=stitle,
            category=scat,
            version=sver,
            owner=sowner,
            status="Active",
            effective_date="2026-01-01",
            steps_json=ssteps
        )
        db.add(sop)
        db.commit()

    print("Seeding KPIs (10 KPIs)...")
    kpis_data = [
        ("Active Parish Member Engagement", "Community", 1000.0, 842.0, "members", "2026 Q3", "On Track", "+14%"),
        ("Monthly Active Volunteer Force", "Volunteers", 150.0, 128.0, "volunteers", "2026 Q3", "On Track", "+22%"),
        ("Volunteer Hours Contributed (YTD)", "Volunteers", 5000.0, 4820.0, "hours", "2026 YTD", "On Track", "+18%"),
        ("Welfare Case Emergency Resolution Time", "Welfare", 48.0, 32.5, "hours", "2026 Q3", "On Track", "-35% (Faster)"),
        ("Youth Education Mentorship Participation", "Education", 200.0, 185.0, "students", "2026 Q3", "On Track", "+30%"),
        ("Free Community Health Checkups", "Healthcare", 1000.0, 920.0, "patients", "2026 YTD", "On Track", "+25%"),
        ("Annual Fundraising Target Achievement", "Fundraising", 300000.0, 248000.0, "INR", "2026 YTD", "On Track", "82.6%"),
        ("Community Event Attendance Rate", "Events", 85.0, 91.2, "% capacity", "2026 Q3", "Completed", "+6.2%"),
        ("Digital Announcement Reach Rate", "Communication", 90.0, 88.5, "% members", "2026 Q3", "On Track", "+10%"),
        ("SOP Compliance & Governance Audit Rating", "Administration", 100.0, 98.0, "% score", "2026 Q3", "On Track", "Excellent"),
    ]

    for kname, kcat, ktarget, kcurr, kunit, kper, kstat, ktr in kpis_data:
        kp = models.KPI(
            name=kname,
            category=kcat,
            target_value=ktarget,
            current_value=kcurr,
            unit=kunit,
            period=kper,
            status=kstat,
            owner="Parish Secretariat",
            trend=ktr
        )
        db.add(kp)
        db.commit()

    print("Seeding Audit Logs...")
    audit_events = [
        ("Father Joseph Thomas", "super_admin", "USER_LOGIN", "Authentication", "1", "Super Admin logged in successfully."),
        ("Sister Maria Rodriguez", "parish_admin", "SUPPORT_CASE_ACCESS", "SupportCase", "CASE-2026-501", "Accessed confidential welfare support case details."),
        ("David Chen", "committee_leader", "EVENT_CREATED", "Event", "2", "Created new event: Youth Hackathon for Social Good."),
        ("Grace Okonjo", "volunteer", "VOLUNTEER_HOURS_LOGGED", "VolunteerHour", "1", "Logged 4.5 hours for Healthcare Clinic outreach."),
        ("Robert Taylor", "member", "SERVICE_REQUESTED", "ServiceRequest", "SR-2026-1001", "Submitted service request for Education Tutoring."),
    ]

    for uname, urole, act, rtype, rid, det in audit_events:
        al = models.AuditLog(
            user_id=1,
            user_name=uname,
            user_role=urole,
            action=act,
            resource_type=rtype,
            resource_id=rid,
            details=det
        )
        db.add(al)
        db.commit()

    print("Database seeding completed successfully!")
    db.close()

if __name__ == "__main__":
    seed_db()

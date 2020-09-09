import { Component, OnInit } from "@angular/core";
import { LayoutConfigService } from "../../../../app/core/_base/layout";
@Component({
    templateUrl: "./welcome.component.html",
    styleUrls: ["./welcome.component.scss"],
})
export class WelcomeComponent implements OnInit {
    moduleLists: any[] = [
        {
            id: 1,
            name: "HRM",
            subDesc: "Human Resource Management",
            status: "Inactive",
            integrateStatus: "uninstalled",
            description: `Personnel management is the planning, organizing, compensation, integration, and maintenance of people for the purpose of contributing to organizational, individual and societal goals.`,
            link: "/main/hrm",
            iconClass: "flaticon2-user-1",
        },
        {
            name: "Recruitment",
            subDesc: "Recruitment Process",
            status: "Active",
            integrateStatus: "installed",
            description: `Recruitment management to manage Applicant Tracking System along with job portal,
      account of job seekers/employers, etc., `,
            link: "http://jobharu.com",
            isExternalLink: true,
            iconClass: "flaticon2-group",
        },
        {
            name: "Beruju",
            subDesc: "बेरुजु Management",
            status: "Active",
            integrateStatus: "installed",
            description: `Beruju (बेरुजु)`,
            link: "/main/beruju",
            iconClass: "flaticon2-writing",
        },
        {
            name: "Darta Chalani",
            subDesc: "दर्ता चलानी Management",
            status: "Active",
            integrateStatus: "installed",
            description:
                "सूचना प्रविधिको बढ्दो विकाससँगै रजिष्ट्ररमा गरिने दर्ता चलानीलाई क्रमशः विस्थापितगर्दै कम्प्यूटर सिष्टमबाट दर्ता चलानी गर्ने परिपाटीको विकास गर्न यो सप्mटवेयरले मद्दत पुग्नेछ",
            link: "/main/dartachalani",
            iconClass: "flaticon-interface-4",
        },
        {
            id: 2,
            name: "Inventory",
            subDesc: "Automate Inventory Operations",
            status: "Inactive",
            integrateStatus: "uninstalled",
            description:
                "Inventory management includes aspects such as controlling and overseeing purchases — from suppliers as well as customers — maintaining the storage of stock, controlling the amount of product for sale, and order fulfillment.",
            link: "/main/inventory",
            iconClass: "flaticon2-shopping-cart",
        },
        {
            id: 3,
            name: "Attendance",
            subDesc: "Managing Attendance or Presence",
            status: "Inactive",
            integrateStatus: "uninstalled",
            description: `Managing attendance of employees at work to minimize loss due to productivity and
       employee absence. Positive attendance management strategy relies on incentives and recognition, effective employee engagement and transparent communication`,
            link: "/main/attendance",
            iconClass: "flaticon2-crisp-icons-1",
        },
        {
            id: 99,
            name: "Document Management",
            subDesc: "Managing Documents",
            status: "Inactive",
            integrateStatus: "uninstalled",
            description: `A document management system is a system used to receive, track, manage and store documents and reduce paper. Most are capable of keeping a record of the various versions created and modified by different users.`,
            link: "/main/doc-man",
            iconClass: "flaticon2-crisp-icons-1",
        },
        {
            id: 98,
            name: "Organization",
            subDesc: "Managing Organization",
            status: "Inactive",
            integrateStatus: "uninstalled",
            description: `Organization Management system automates the management of membership within associations, communities and other member-based organizations..`,
            link: "/main/organization/dashboard",
            iconClass: "flaticon2-crisp-icons-1",
        },
        {
            id: 98,
            name: "Travel",
            subDesc: "Managing Travel details",
            status: "Inactive",
            integrateStatus: "uninstalled",
            description: `Travel Management system automates the management of membership within associations, communities and other member-based organizations..`,
            link: "/main/travel/dashboard",
            iconClass: "flaticon2-delivery-truck",
        },
        // {
        //   id: 4,
        //   name: 'Food Court',
        //   status: 'Inactive',
        //   integrateStatus: 'uninstalled',
        //   description: `The more you know the customer’s intentions, the more you can offer personalized services to them. Food Court automates the learning process and makes it easier to engage the right customers with the right food items and beverages.`,
        //   link: '/food-court/main'
        // },
    ];

    constructor(private l: LayoutConfigService) { }

    ngOnInit(): void {
        // TODO: hide aside when welcome screen. use router event to do from hee instead of entire module.
        // this.l.layoutConfig.content.width = 'fixed';
        // const lay = objectPath.set(this.l.layoutConfig, 'aside.self.display', false, false);
        // const o = objectPath.get(this.l.layoutConfig, '');
        // // o.self.co = 'boxed';
        // this.l.setConfig(o, true);
        // console.log(o);
        // this.l.layoutConfig.aside.self.display = false;
    }
}

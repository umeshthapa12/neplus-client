import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { BaseUrlCreator, ParamGenService } from '../../../../../../../src/app/utils';
import { ResponseModel, QueryModel } from '../../../../../../../src/app/models';

@Injectable()
export class ChalaniService {
    private readonly api = this.url.createUrl('', '');

    constructor(
        private http: HttpClient,
        private url: BaseUrlCreator,
        private paramGen: ParamGenService
    ) {
        const data = JSON.parse(localStorage.getItem('data'));
        if (data !== null && data.length === 0) {
            localStorage.setItem('data', JSON.stringify(
                [
                    {
                        id: 102, sn: 1, invoiceNo: '२०७७/१२/०१/००५४', branchIds: ['मोरंग'],
                        receivers: ['नेपाल सरकार संघिय मामिला तथा सामान्य प्रशासन मन्त्रालय'], subject: 'विवरण उपलब्ध गराईदिने बारे',
                        LetterKindId: ['प्रशासन शाखा'], officeAddress: 'काठमाडौँ नेपाल', isCorrect: true, remarks: 'सबै ठिक छ'
                    },
                    {
                        id: 1032, sn: 2, invoiceNo: '२०७७/१२/०१/००५५', branchIds: ['कास्की'],
                        receivers: ['नेपाल सरकार संघिय मामिला तथा सामान्य प्रशासन मन्त्रालय'], subject: 'सुत्र लेखा प्रणाली लागु गर्ने सम्बन्धमा',
                        LetterKindId: ['प्राबिधिक शाखा'], officeAddress: 'सिंहदरबार,काठमाडौँ', isCorrect: true, remarks: 'सबै ठिक छ'
                    },
                    {
                        id: 1252, sn: 3, invoiceNo: '२०७७/१२/०१/००५६', branchIds: ['कन्द्रिय समन्वय इकाई'],
                        receivers: ['नेपाल सरकार संघिय मामिला तथा सामान्य प्रशासन मन्त्रालय'], subject: 'पुन: ताकेता सम्बन्धमा',
                        LetterKindId: ['आर्थिक प्रशासन शाखा'], officeAddress: 'सिंहदरबार,काठमाडौँ', isCorrect: true, remarks: 'सबै ठिक छ'
                    },
                    {
                        id: 1255, sn: 4, invoiceNo: '२०७७/१२/०१/५७', branchIds: ['कन्द्रिय समन्वय इकाई'],
                        receivers: ['नेपाल सरकार संघिय मामिला तथा सामान्य प्रशासन मन्त्रालय'], subject: 'सुत्र लेखा प्रणाली लागु गर्ने सम्बन्धमा',
                        LetterKindId: ['प्रशासन शाखा'], officeAddress: 'काठमाडौँ', isCorrect: true, remarks: 'सबै ठिक छ'
                    },
                    {
                        id: 2142, sn: 5, invoiceNo: '२०७७/१२/०१/००५८', branchIds: ['काठमाडौँ'],
                        receivers: ['नेपाल सरकार संघिय मामिला तथा सामान्य प्रशासन मन्त्रालय'], subject: 'SEDP मा मनोनयन गरी पठाइएको',
                        LetterKindId: ['प्राबिधिक शाखा'], officeAddress: 'काठमाडौँ', isCorrect: true, remarks: 'सबै ठिक छ'
                    },
                    {
                        id: 3125, sn: 6, invoiceNo: '२०७७/१२/०१/००५९', branchIds: ['कन्द्रिय समन्वय इकाई'],
                        receivers: ['नेपाल सरकार संघिय मामिला तथा सामान्य प्रशासन मन्त्रालय'], subject: 'स्थापित पर्यटकीय गन्तब्यको आवस्यक पुर्वधार विकास निर्माण कार्यक्रम सम्बन्धमा',
                        LetterKindId: ['राजस्व शाखा'], officeAddress: 'बबरमहल,काठमाडौँ', isCorrect: true, remarks: 'सबै ठिक छ'
                    },
                    {
                        id: 6123, sn: 7, invoiceNo: '२०७७/१२/०१/००६०', branchIds: ['कास्की'],
                        receivers: ['नेपाल सरकार संघिय मामिला तथा सामान्य प्रशासन मन्त्रालय'], subject: 'शिक्षक तलब भत्ता सम्बन्धमा',
                        LetterKindId: ['आर्थिक प्रशासन शाखा'], officeAddress: 'काठमाडौँ', isCorrect: true, remarks: 'सबै ठिक छ'
                    },
                    {
                        id: 5121, sn: 8, invoiceNo: '२०७७/१२/०१/००६१', branchIds: ['मोरंग'],
                        receivers: ['नेपाल सरकार संघिय मामिला तथा सामान्य प्रशासन मन्त्रालय'], subject: 'कन्सुलर प्रमाणीकरण सम्बन्धमा',
                        LetterKindId: ['प्राबिधिक शाखा'], officeAddress: 'बबरमहल,काठमाडौँ', isCorrect: true, remarks: 'सबै ठिक छ'
                    },
                    {
                        id: 9212, sn: 9, invoiceNo: '२०७७/१२/०१/००६२', branchIds: ['कास्की'],
                        receivers: ['नेपाल सरकार संघिय मामिला तथा सामान्य प्रशासन मन्त्रालय'], subject: 'सुत्र लेखा प्रणाली लागु गर्ने सम्बन्धमा',
                        LetterKindId: ['राजस्व शाखा'], officeAddress: 'काठमाडौँ', isCorrect: true, remarks: 'सबै ठिक छ'
                    },
                    {
                        id: 1523, sn: 10, invoiceNo: '२०७७/१२/०१/००६३', branchIds: ['स्थानीय तह समन्वय शाखा'],
                        receivers: ['नेपाल सरकार संघिय मामिला तथा सामान्य प्रशासन मन्त्रालय'], subject: 'आयोजना/कार्यक्रम माग/प्रस्ताव पेश गर्ने सम्बन्धी सूचना',
                        LetterKindId: ['आर्थिक प्रशासन शाखा'], officeAddress: 'बबरमहल,काठमाडौँ', isCorrect: true, remarks: 'सबै ठिक छ'
                    },
                    {
                        id: 15232, sn: 11, invoiceNo: '२०७७/१२/०१/००६३', branchIds: ['स्थानीय तह समन्वय शाखा'],
                        receivers: ['नेपाल सरकार संघिय मामिला तथा सामान्य प्रशासन मन्त्रालय'], subject: 'आयोजना/कार्यक्रम माग/प्रस्ताव पेश गर्ने सम्बन्धी सूचना',
                        LetterKindId: ['आर्थिक प्रशासन शाखा'], officeAddress: 'बबरमहल,काठमाडौँ', isCorrect: true, remarks: 'सबै ठिक छ'
                    },
                    {
                        id: 15223, sn: 12, invoiceNo: '२०७७/१२/०१/००६३', branchIds: ['स्थानीय तह समन्वय शाखा'],
                        receivers: ['नेपाल सरकार संघिय मामिला तथा सामान्य प्रशासन मन्त्रालय'], subject: 'आयोजना/कार्यक्रम माग/प्रस्ताव पेश गर्ने सम्बन्धी सूचना',
                        LetterKindId: ['आर्थिक प्रशासन शाखा'], officeAddress: 'बबरमहल,काठमाडौँ', isCorrect: true, remarks: 'सबै ठिक छ'
                    },
                    {
                        id: 15223, sn: 13, invoiceNo: '२०७७/१२/०१/००६३', branchIds: ['स्थानीय तह समन्वय शाखा'],
                        receivers: ['नेपाल सरकार संघिय मामिला तथा सामान्य प्रशासन मन्त्रालय'], subject: 'आयोजना/कार्यक्रम माग/प्रस्ताव पेश गर्ने सम्बन्धी सूचना',
                        LetterKindId: ['आर्थिक प्रशासन शाखा'], officeAddress: 'बबरमहल,काठमाडौँ', isCorrect: true, remarks: 'सबै ठिक छ'
                    },
                    {
                        id: 15623, sn: 14, invoiceNo: '२०७७/१२/०१/००६३', branchIds: ['स्थानीय तह समन्वय शाखा'],
                        receivers: ['नेपाल सरकार संघिय मामिला तथा सामान्य प्रशासन मन्त्रालय'], subject: 'आयोजना/कार्यक्रम माग/प्रस्ताव पेश गर्ने सम्बन्धी सूचना',
                        LetterKindId: ['आर्थिक प्रशासन शाखा'], officeAddress: 'बबरमहल,काठमाडौँ', isCorrect: true, remarks: 'सबै ठिक छ'
                    },
                    {
                        id: 15203, sn: 15, invoiceNo: '२०७७/१२/०१/००६३', branchIds: ['स्थानीय तह समन्वय शाखा'],
                        receivers: ['नेपाल सरकार संघिय मामिला तथा सामान्य प्रशासन मन्त्रालय'], subject: 'आयोजना/कार्यक्रम माग/प्रस्ताव पेश गर्ने सम्बन्धी सूचना',
                        LetterKindId: ['आर्थिक प्रशासन शाखा'], officeAddress: 'बबरमहल,काठमाडौँ', isCorrect: true, remarks: 'सबै ठिक छ'
                    },
                    {
                        id: 10523, sn: 15, invoiceNo: '२०७७/१२/०१/००६३', branchIds: ['स्थानीय तह समन्वय शाखा'],
                        receivers: ['नेपाल सरकार संघिय मामिला तथा सामान्य प्रशासन मन्त्रालय'], subject: 'आयोजना/कार्यक्रम माग/प्रस्ताव पेश गर्ने सम्बन्धी सूचना',
                        LetterKindId: ['आर्थिक प्रशासन शाखा'], officeAddress: 'बबरमहल,काठमाडौँ', isCorrect: true, remarks: 'सबै ठिक छ'
                    },
                    {
                        id: 15723, sn: 16, invoiceNo: '२०७७/१२/०१/००६३', branchIds: ['स्थानीय तह समन्वय शाखा'],
                        receivers: ['नेपाल सरकार संघिय मामिला तथा सामान्य प्रशासन मन्त्रालय'], subject: 'आयोजना/कार्यक्रम माग/प्रस्ताव पेश गर्ने सम्बन्धी सूचना',
                        LetterKindId: ['आर्थिक प्रशासन शाखा'], officeAddress: 'बबरमहल,काठमाडौँ', isCorrect: true, remarks: 'सबै ठिक छ'
                    },
                    {
                        id: 156623, sn: 17, invoiceNo: '२०७७/१२/०१/००६३', branchIds: ['स्थानीय तह समन्वय शाखा'],
                        receivers: ['नेपाल सरकार संघिय मामिला तथा सामान्य प्रशासन मन्त्रालय'], subject: 'आयोजना/कार्यक्रम माग/प्रस्ताव पेश गर्ने सम्बन्धी सूचना',
                        LetterKindId: ['आर्थिक प्रशासन शाखा'], officeAddress: 'बबरमहल,काठमाडौँ', isCorrect: true, remarks: 'सबै ठिक छ'
                    },
                    {
                        id: 156523, sn: 18, invoiceNo: '२०७७/१२/०१/००६३', branchIds: ['स्थानीय तह समन्वय शाखा'],
                        receivers: ['नेपाल सरकार संघिय मामिला तथा सामान्य प्रशासन मन्त्रालय'], subject: 'आयोजना/कार्यक्रम माग/प्रस्ताव पेश गर्ने सम्बन्धी सूचना',
                        LetterKindId: ['आर्थिक प्रशासन शाखा'], officeAddress: 'बबरमहल,काठमाडौँ', isCorrect: true, remarks: 'सबै ठिक छ'
                    },
                    {
                        id: 158623, sn: 19, invoiceNo: '२०७७/१२/०१/००६३', branchIds: ['स्थानीय तह समन्वय शाखा'],
                        receivers: ['नेपाल सरकार संघिय मामिला तथा सामान्य प्रशासन मन्त्रालय'], subject: 'आयोजना/कार्यक्रम माग/प्रस्ताव पेश गर्ने सम्बन्धी सूचना',
                        LetterKindId: ['आर्थिक प्रशासन शाखा'], officeAddress: 'बबरमहल,काठमाडौँ', isCorrect: true, remarks: 'सबै ठिक छ'
                    }
                ]));
        } else if (data === null) {
            localStorage.setItem('data', JSON.stringify(
                [
                    {
                        id: 102, sn: 1, invoiceNo: '२०७७/१२/०१/००५४', branchIds: ['मोरंग'],
                        receivers: ['नेपाल सरकार संघिय मामिला तथा सामान्य प्रशासन मन्त्रालय'], subject: 'विवरण उपलब्ध गराईदिने बारे',
                        LetterKindId: ['प्रशासन शाखा'], officeAddress: 'काठमाडौँ नेपाल', isCorrect: true, remarks: 'सबै ठिक छ'
                    },
                    {
                        id: 1032, sn: 2, invoiceNo: '२०७७/१२/०१/००५५', branchIds: ['कास्की'],
                        receivers: ['नेपाल सरकार संघिय मामिला तथा सामान्य प्रशासन मन्त्रालय'], subject: 'सुत्र लेखा प्रणाली लागु गर्ने सम्बन्धमा',
                        LetterKindId: ['प्राबिधिक शाखा'], officeAddress: 'सिंहदरबार,काठमाडौँ', isCorrect: true, remarks: 'सबै ठिक छ'
                    },
                    {
                        id: 1252, sn: 3, invoiceNo: '२०७७/१२/०१/००५६', branchIds: ['कन्द्रिय समन्वय इकाई'],
                        receivers: ['नेपाल सरकार संघिय मामिला तथा सामान्य प्रशासन मन्त्रालय'], subject: 'पुन: ताकेता सम्बन्धमा',
                        LetterKindId: ['आर्थिक प्रशासन शाखा'], officeAddress: 'सिंहदरबार,काठमाडौँ', isCorrect: true, remarks: 'सबै ठिक छ'
                    },
                    {
                        id: 1255, sn: 4, invoiceNo: '२०७७/१२/०१/५७', branchIds: ['कन्द्रिय समन्वय इकाई'],
                        receivers: ['नेपाल सरकार संघिय मामिला तथा सामान्य प्रशासन मन्त्रालय'], subject: 'सुत्र लेखा प्रणाली लागु गर्ने सम्बन्धमा',
                        LetterKindId: ['प्रशासन शाखा'], officeAddress: 'काठमाडौँ', isCorrect: true, remarks: 'सबै ठिक छ'
                    },
                    {
                        id: 2142, sn: 5, invoiceNo: '२०७७/१२/०१/००५८', branchIds: ['काठमाडौँ'],
                        receivers: ['नेपाल सरकार संघिय मामिला तथा सामान्य प्रशासन मन्त्रालय'], subject: 'SEDP मा मनोनयन गरी पठाइएको',
                        LetterKindId: ['प्राबिधिक शाखा'], officeAddress: 'काठमाडौँ', isCorrect: true, remarks: 'सबै ठिक छ'
                    },
                    {
                        id: 3125, sn: 6, invoiceNo: '२०७७/१२/०१/००५९', branchIds: ['कन्द्रिय समन्वय इकाई'],
                        receivers: ['नेपाल सरकार संघिय मामिला तथा सामान्य प्रशासन मन्त्रालय'], subject: 'स्थापित पर्यटकीय गन्तब्यको आवस्यक पुर्वधार विकास निर्माण कार्यक्रम सम्बन्धमा',
                        LetterKindId: ['राजस्व शाखा'], officeAddress: 'बबरमहल,काठमाडौँ', isCorrect: true, remarks: 'सबै ठिक छ'
                    },
                    {
                        id: 6123, sn: 7, invoiceNo: '२०७७/१२/०१/००६०', branchIds: ['कास्की'],
                        receivers: ['नेपाल सरकार संघिय मामिला तथा सामान्य प्रशासन मन्त्रालय'], subject: 'शिक्षक तलब भत्ता सम्बन्धमा',
                        LetterKindId: ['आर्थिक प्रशासन शाखा'], officeAddress: 'काठमाडौँ', isCorrect: true, remarks: 'सबै ठिक छ'
                    },
                    {
                        id: 5121, sn: 8, invoiceNo: '२०७७/१२/०१/००६१', branchIds: ['मोरंग'],
                        receivers: ['नेपाल सरकार संघिय मामिला तथा सामान्य प्रशासन मन्त्रालय'], subject: 'कन्सुलर प्रमाणीकरण सम्बन्धमा',
                        LetterKindId: ['प्राबिधिक शाखा'], officeAddress: 'बबरमहल,काठमाडौँ', isCorrect: true, remarks: 'सबै ठिक छ'
                    },
                    {
                        id: 9212, sn: 9, invoiceNo: '२०७७/१२/०१/००६२', branchIds: ['कास्की'],
                        receivers: ['नेपाल सरकार संघिय मामिला तथा सामान्य प्रशासन मन्त्रालय'], subject: 'सुत्र लेखा प्रणाली लागु गर्ने सम्बन्धमा',
                        LetterKindId: ['राजस्व शाखा'], officeAddress: 'काठमाडौँ', isCorrect: true, remarks: 'सबै ठिक छ'
                    },
                    {
                        id: 1523, sn: 10, invoiceNo: '२०७७/१२/०१/००६३', branchIds: ['स्थानीय तह समन्वय शाखा'],
                        receivers: ['नेपाल सरकार संघिय मामिला तथा सामान्य प्रशासन मन्त्रालय'], subject: 'आयोजना/कार्यक्रम माग/प्रस्ताव पेश गर्ने सम्बन्धी सूचना',
                        LetterKindId: ['आर्थिक प्रशासन शाखा'], officeAddress: 'बबरमहल,काठमाडौँ', isCorrect: true, remarks: 'सबै ठिक छ'
                    },
                    {
                        id: 15232, sn: 11, invoiceNo: '२०७७/१२/०१/००६३', branchIds: ['स्थानीय तह समन्वय शाखा'],
                        receivers: ['नेपाल सरकार संघिय मामिला तथा सामान्य प्रशासन मन्त्रालय'], subject: 'आयोजना/कार्यक्रम माग/प्रस्ताव पेश गर्ने सम्बन्धी सूचना',
                        LetterKindId: ['आर्थिक प्रशासन शाखा'], officeAddress: 'बबरमहल,काठमाडौँ', isCorrect: true, remarks: 'सबै ठिक छ'
                    },
                    {
                        id: 15223, sn: 12, invoiceNo: '२०७७/१२/०१/००६३', branchIds: ['स्थानीय तह समन्वय शाखा'],
                        receivers: ['नेपाल सरकार संघिय मामिला तथा सामान्य प्रशासन मन्त्रालय'], subject: 'आयोजना/कार्यक्रम माग/प्रस्ताव पेश गर्ने सम्बन्धी सूचना',
                        LetterKindId: ['आर्थिक प्रशासन शाखा'], officeAddress: 'बबरमहल,काठमाडौँ', isCorrect: true, remarks: 'सबै ठिक छ'
                    },
                    {
                        id: 15223, sn: 13, invoiceNo: '२०७७/१२/०१/००६३', branchIds: ['स्थानीय तह समन्वय शाखा'],
                        receivers: ['नेपाल सरकार संघिय मामिला तथा सामान्य प्रशासन मन्त्रालय'], subject: 'आयोजना/कार्यक्रम माग/प्रस्ताव पेश गर्ने सम्बन्धी सूचना',
                        LetterKindId: ['आर्थिक प्रशासन शाखा'], officeAddress: 'बबरमहल,काठमाडौँ', isCorrect: true, remarks: 'सबै ठिक छ'
                    },
                    {
                        id: 15623, sn: 14, invoiceNo: '२०७७/१२/०१/००६३', branchIds: ['स्थानीय तह समन्वय शाखा'],
                        receivers: ['नेपाल सरकार संघिय मामिला तथा सामान्य प्रशासन मन्त्रालय'], subject: 'आयोजना/कार्यक्रम माग/प्रस्ताव पेश गर्ने सम्बन्धी सूचना',
                        LetterKindId: ['आर्थिक प्रशासन शाखा'], officeAddress: 'बबरमहल,काठमाडौँ', isCorrect: true, remarks: 'सबै ठिक छ'
                    },
                    {
                        id: 15203, sn: 15, invoiceNo: '२०७७/१२/०१/००६३', branchIds: ['स्थानीय तह समन्वय शाखा'],
                        receivers: ['नेपाल सरकार संघिय मामिला तथा सामान्य प्रशासन मन्त्रालय'], subject: 'आयोजना/कार्यक्रम माग/प्रस्ताव पेश गर्ने सम्बन्धी सूचना',
                        LetterKindId: ['आर्थिक प्रशासन शाखा'], officeAddress: 'बबरमहल,काठमाडौँ', isCorrect: true, remarks: 'सबै ठिक छ'
                    },
                    {
                        id: 10523, sn: 15, invoiceNo: '२०७७/१२/०१/००६३', branchIds: ['स्थानीय तह समन्वय शाखा'],
                        receivers: ['नेपाल सरकार संघिय मामिला तथा सामान्य प्रशासन मन्त्रालय'], subject: 'आयोजना/कार्यक्रम माग/प्रस्ताव पेश गर्ने सम्बन्धी सूचना',
                        LetterKindId: ['आर्थिक प्रशासन शाखा'], officeAddress: 'बबरमहल,काठमाडौँ', isCorrect: true, remarks: 'सबै ठिक छ'
                    },
                    {
                        id: 15723, sn: 16, invoiceNo: '२०७७/१२/०१/००६३', branchIds: ['स्थानीय तह समन्वय शाखा'],
                        receivers: ['नेपाल सरकार संघिय मामिला तथा सामान्य प्रशासन मन्त्रालय'], subject: 'आयोजना/कार्यक्रम माग/प्रस्ताव पेश गर्ने सम्बन्धी सूचना',
                        LetterKindId: ['आर्थिक प्रशासन शाखा'], officeAddress: 'बबरमहल,काठमाडौँ', isCorrect: true, remarks: 'सबै ठिक छ'
                    },
                    {
                        id: 156623, sn: 17, invoiceNo: '२०७७/१२/०१/००६३', branchIds: ['स्थानीय तह समन्वय शाखा'],
                        receivers: ['नेपाल सरकार संघिय मामिला तथा सामान्य प्रशासन मन्त्रालय'], subject: 'आयोजना/कार्यक्रम माग/प्रस्ताव पेश गर्ने सम्बन्धी सूचना',
                        LetterKindId: ['आर्थिक प्रशासन शाखा'], officeAddress: 'बबरमहल,काठमाडौँ', isCorrect: true, remarks: 'सबै ठिक छ'
                    },
                    {
                        id: 156523, sn: 18, invoiceNo: '२०७७/१२/०१/००६३', branchIds: ['स्थानीय तह समन्वय शाखा'],
                        receivers: ['नेपाल सरकार संघिय मामिला तथा सामान्य प्रशासन मन्त्रालय'], subject: 'आयोजना/कार्यक्रम माग/प्रस्ताव पेश गर्ने सम्बन्धी सूचना',
                        LetterKindId: ['आर्थिक प्रशासन शाखा'], officeAddress: 'बबरमहल,काठमाडौँ', isCorrect: true, remarks: 'सबै ठिक छ'
                    },
                    {
                        id: 158623, sn: 19, invoiceNo: '२०७७/१२/०१/००६३', branchIds: ['स्थानीय तह समन्वय शाखा'],
                        receivers: ['नेपाल सरकार संघिय मामिला तथा सामान्य प्रशासन मन्त्रालय'], subject: 'आयोजना/कार्यक्रम माग/प्रस्ताव पेश गर्ने सम्बन्धी सूचना',
                        LetterKindId: ['आर्थिक प्रशासन शाखा'], officeAddress: 'बबरमहल,काठमाडौँ', isCorrect: true, remarks: 'सबै ठिक छ'
                    }
                ]));
        }
    }

    getChalani<T extends ResponseModel>(params?: QueryModel): Observable<T> {
        const p = this.paramGen.createParams(params);
        return this.http.get<T>(`${this.api}/Get`, { params: p });
    }

    getChalaniById<T extends ResponseModel>(id: number): Observable<T> {
        return this.http.get<T>(`${this.api}/Get/${id}`);
    }

    addOrUpdate<T extends ResponseModel>(body: any): Observable<T> {

        return body.id > 0
            ? this.http.put<T>(`${this.api}/Update`, body)
            : this.http.post<T>(`${this.api}/Create`, body);
    }

    deleteChalani<T extends ResponseModel>(id: number): Observable<T> {
        return this.http.delete<T>(`${this.api}/Delete/${id}`);
    }

    getList(): Observable<any> {
        const d = JSON.parse(localStorage.getItem('data'));
        if (d !== null) {
            return of(d);
        } else {
            localStorage.setItem('data', JSON.stringify([]));
            const data = JSON.parse(localStorage.getItem('data'));
            return of(data);
        }
    }

    getListById(id: number): Observable<any> {
        const d = JSON.parse(localStorage.getItem('data'));
        if (d !== null) {
            const e = d.find(_ => _.id === id);
            return of(e);
        } else {
            localStorage.setItem('data', JSON.stringify([]));
            const data = JSON.parse(localStorage.getItem('data'));
            const e = data.find(_ => _.id === id);
            return of(e);
        }
    }

    deleteList(id: number): Observable<any> {
        const data = JSON.parse(localStorage.getItem('data'));
        if (data !== null) {
            const i = data.findIndex(_ => _.id === id);
            data.splice(i, 1);
            localStorage.setItem('data', JSON.stringify(data));
            return of(data);
        } else {
            localStorage.setItem('data', JSON.stringify([]));
            const d = JSON.parse(localStorage.getItem('data'));
            const i = d.findIndex(_ => _.id === id);
            d.splice(i, 1);
            localStorage.setItem('data', JSON.stringify(data));
            return of(d);
        }
    }

    update(body: any): Observable<any> {
        const d = JSON.parse(localStorage.getItem('data'));
        if (d !== null) {
            const eValue = d.findIndex(x => x.id === body.id);
            body.sn = d[eValue].sn;
            d[eValue] = body;
            localStorage.setItem('data', JSON.stringify(d));
            return of(body);
        } else {
            localStorage.setItem('data', JSON.stringify([]));
            const data = JSON.parse(localStorage.getItem('data'));
            const eValue = data.findIndex(x => x.id === body.id);
            data[eValue] = body;
            localStorage.setItem('data', JSON.stringify(data));
            return of(body);
        }
    }

    add(body: any): Observable<any> {
        const data = JSON.parse(localStorage.getItem('data'));
        if (data !== null) {
            data.push(body);
            body.id = data.length + 1;
            body.sn = data.length + 1;
            localStorage.setItem('data', JSON.stringify(data));
            return of(body);
        } else {
            localStorage.setItem('data', JSON.stringify([]));
            const d = JSON.parse(localStorage.getItem('darta'));
            d.push(body);
            body.id = d.length + 1;
            body.sn = d.length + 1;
            localStorage.setItem('data', JSON.stringify(d));
            return of(body);
        }
    }

}

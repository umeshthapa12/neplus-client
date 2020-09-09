import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BaseUrlCreator, ParamGenService } from '../../../../../../../src/app/utils';
import { ResponseModel, QueryModel } from '../../../../../../../src/app/models';

@Injectable()
export class DartaService {

    private readonly api = this.url.createUrl('', '');

    constructor(
        private http: HttpClient,
        private url: BaseUrlCreator,
        private paramGen: ParamGenService
    ) {
        const data = JSON.parse(localStorage.getItem('darta'));
        if (data !== null && data.length === 0) {
            localStorage.setItem('darta', JSON.stringify([
                {
                    id: 102, sn: 1, regNo: 348,
                    senderOfficeName: 'नेपाल सरकार संघिय मामिला तथा सामान्य प्रशासन मन्त्रालय', subject: 'विवरण उपलब्ध गराईदिने बारे',
                    letterKind: ['प्रशासन शाखा'], senderOfficeAddress: 'काठमाडौँ नेपाल',
                    isCorrect: true, remarks: 'सबै ठिक छ', letterRegNo: '२०७७/१२/०१/००५४', noOfLetter: 2154,
                    branchIds: ['काठमाडौँ'],
                },
                {
                    id: 981, sn: 2, regNo: 2363,
                    senderOfficeName: 'नेपाल सरकार संघिय मामिला तथा सामान्य प्रशासन मन्त्रालय',
                    subject: 'आयोजना/कार्यक्रम माग/प्रस्ताव पेश गर्ने सम्बन्धी सूचना',
                    letterKind: ['प्राबिधिक शाखा'], senderOfficeAddress: 'सिंहदरबार, काठमाडौँ',
                    isCorrect: true, remarks: 'सबै ठिक छ', letterRegNo: '२०७७/१२/०१/००५५', noOfLetter: 2156,
                    branchIds: ['कन्द्रिय समन्वय इकाई'],
                },
                {
                    id: 231, sn: 3, regNo: 3125,
                    senderOfficeName: 'शिक्षा तथा मानब स्रोत विकास केन्द्र',
                    subject: 'शिक्षक तलब भत्ता सम्बन्धमा',
                    letterKind: ['प्राबिधिक शाखा'], senderOfficeAddress: 'सानो ठिमी,भक्तपुर',
                    isCorrect: true, remarks: 'सबै ठिक छ', letterRegNo: '२०७७/१२/०१/००५६', noOfLetter: 2163,
                    branchIds: ['काठमाडौँ'],
                },
                {
                    id: 231, sn: 4, regNo: 1235,
                    senderOfficeName: 'नेपाल सरकार संघिय मामिला तथा सामान्य प्रशासन मन्त्रालय',
                    subject: 'पुन: ताकेता सम्बन्धमा', letterKind: ['आर्थिक प्रशासन शाखा'], senderOfficeAddress: 'सिंहदरबार,काठमाडौँ',
                    isCorrect: true, remarks: 'सबै ठिक छ', letterRegNo: '२०७७/१२/०१/००५७', noOfLetter: 2166,
                    branchIds: ['स्थानीय तह समन्वय शाखा'],
                },
                {
                    id: 522, sn: 5, regNo: 5675,
                    senderOfficeName: 'सस्कृति पर्यटन तथा नागरिक उड्डयन मन्त्रालय',
                    subject: 'स्थापित पर्यटकीय गन्तब्यको आवस्यक पुर्वधार विकास निर्माण कार्यक्रम सम्बन्धमा ',
                    letterKind: ['राजस्व शाखा'], senderOfficeAddress: 'सिंहदरबार,काठमाडौँ',
                    isCorrect: true, remarks: 'सबै ठिक छ', letterRegNo: '२०७७/१२/०१/००५८', noOfLetter: 2169,
                    branchIds: ['प्रसासन योजना महाशाखा'],
                },
                {
                    id: 243, sn: 6, regNo: 5685,
                    senderOfficeName: 'नेपाल सरकार संघिय मामिला तथा सामान्य प्रशासन मन्त्रालय',
                    subject: 'सुत्र लेखा प्रणाली लागु गर्ने सम्बन्धमा',
                    letterKind: ['राजस्व शाखा'], senderOfficeAddress: 'सिंहदरबार,काठमाडौँ',
                    isCorrect: true, remarks: 'सबै ठिक छ', letterRegNo: '२०७७/१२/०१/००५९', noOfLetter: 2171,
                    branchIds: ['आर्थिक प्रसासन महाशाखा'],
                },
                {
                    id: 765, sn: 7, regNo: 98725,
                    senderOfficeName: 'नेपाल सरकार संघिय मामिला तथा सामान्य प्रशासन मन्त्रालय',
                    subject: 'कन्सुलर प्रमाणीकरण सम्बन्धमा',
                    letterKind: ['राजस्व शाखा'], senderOfficeAddress: 'सिंहदरबार,काठमाडौँ',
                    isCorrect: true, remarks: 'सबै ठिक छ', letterRegNo: '२०७७/१२/०१/००६०', noOfLetter: 2175,
                    branchIds: ['स्थानीय तह समन्वय शाखा'],
                },
                {
                    id: 765, sn: 8, regNo: 98755,
                    senderOfficeName: 'नेपाल सरकार संघिय मामिला तथा सामान्य प्रशासन मन्त्रालय',
                    subject: 'कन्सुलर प्रमाणीकरण सम्बन्धमा',
                    letterKind: ['राजस्व शाखा'], senderOfficeAddress: 'सिंहदरबार,काठमाडौँ',
                    isCorrect: true, remarks: 'सबै ठिक छ', letterRegNo: '२०७७/१२/०१/००६१', noOfLetter: 2177,
                    branchIds: ['स्थानीय तह समन्वय शाखा'],
                },
                {
                    id: 2331, sn: 9, regNo: 9875,
                    senderOfficeName: 'नेपाल सरकार संघिय मामिला तथा सामान्य प्रशासन मन्त्रालय',
                    subject: 'कार्यमुलक लेखा परिक्षण सम्बन्धमा',
                    letterKind: ['प्राबिधिक शाखा'], senderOfficeAddress: 'सिंहदरबार,काठमाडौँ',
                    isCorrect: true, remarks: 'सबै ठिक छ', letterRegNo: '२०७७/१२/०१/००६२', noOfLetter: 2179,
                    branchIds: ['आर्थिक प्रसासन महाशाखा'],
                },
                {
                    id: 4531, sn: 10, regNo: 12334,
                    senderOfficeName: 'महालेखा परिक्षकको कार्यालय ',
                    subject: 'कार्यमुलक लेखा परिक्षण सम्बन्धमा',
                    letterKind: ['प्राबिधिक शाखा'], senderOfficeAddress: 'बबरमहल,काठमाडौँ ',
                    isCorrect: true, remarks: 'सबै ठिक छ', letterRegNo: '२०७७/१२/०१/००६३', noOfLetter: 2181,
                    branchIds: ['आर्थिक प्रसासन महाशाखा'],
                },
                {
                    id: 12351, sn: 11, regNo: 4983,
                    senderOfficeName: 'नेपाल सरकार संघिय मामिला तथा सामान्य प्रशासन मन्त्रालय',
                    subject: 'SEDP मा मनोनयन गरी पठाइएको',
                    letterKind: ['राजस्व शाखा'], senderOfficeAddress: 'बबरमहल,काठमाडौँ ',
                    isCorrect: true, remarks: 'सबै ठिक छ', letterRegNo: '२०७७/१२/०१/००६४', noOfLetter: 2185,
                    branchIds: ['काठमाडौँ'],
                },
                {
                    id: 123751, sn: 12, regNo: 4983,
                    senderOfficeName: 'नेपाल सरकार संघिय मामिला तथा सामान्य प्रशासन मन्त्रालय',
                    subject: 'SEDP मा मनोनयन गरी पठाइएको',
                    letterKind: ['राजस्व शाखा'], senderOfficeAddress: 'बबरमहल,काठमाडौँ ',
                    isCorrect: true, remarks: 'सबै ठिक छ', letterRegNo: '२०७७/१२/०१/००६४', noOfLetter: 2185,
                    branchIds: ['आर्थिक प्रसासन महाशाखा'],
                },
                {
                    id: 123951, sn: 13, regNo: 4983,
                    senderOfficeName: 'नेपाल सरकार संघिय मामिला तथा सामान्य प्रशासन मन्त्रालय',
                    subject: 'SEDP मा मनोनयन गरी पठाइएको',
                    letterKind: ['राजस्व शाखा'], senderOfficeAddress: 'बबरमहल,काठमाडौँ ',
                    isCorrect: true, remarks: 'सबै ठिक छ', letterRegNo: '२०७७/१२/०१/००६४', noOfLetter: 2185,
                    branchIds: ['काठमाडौँ'],
                },
                {
                    id: 123501, sn: 14, regNo: 4983,
                    senderOfficeName: 'नेपाल सरकार संघिय मामिला तथा सामान्य प्रशासन मन्त्रालय',
                    subject: 'SEDP मा मनोनयन गरी पठाइएको',
                    letterKind: ['राजस्व शाखा'], senderOfficeAddress: 'बबरमहल,काठमाडौँ ',
                    isCorrect: true, remarks: 'सबै ठिक छ', letterRegNo: '२०७७/१२/०१/००६४', noOfLetter: 2185,
                    branchIds: ['काठमाडौँ'],
                },
                {
                    id: 121351, sn: 15, regNo: 4983,
                    senderOfficeName: 'नेपाल सरकार संघिय मामिला तथा सामान्य प्रशासन मन्त्रालय',
                    subject: 'SEDP मा मनोनयन गरी पठाइएको',
                    letterKind: ['राजस्व शाखा'], senderOfficeAddress: 'बबरमहल,काठमाडौँ ',
                    isCorrect: true, remarks: 'सबै ठिक छ', letterRegNo: '२०७७/१२/०१/००६४', noOfLetter: 2185,
                    branchIds: ['आर्थिक प्रसासन महाशाखा'],
                },
                {
                    id: 126351, sn: 16, regNo: 4983,
                    senderOfficeName: 'नेपाल सरकार संघिय मामिला तथा सामान्य प्रशासन मन्त्रालय',
                    subject: 'SEDP मा मनोनयन गरी पठाइएको',
                    letterKind: ['राजस्व शाखा'], senderOfficeAddress: 'बबरमहल,काठमाडौँ ',
                    isCorrect: true, remarks: 'सबै ठिक छ', letterRegNo: '२०७७/१२/०१/००६४', noOfLetter: 2185,
                    branchIds: ['आर्थिक प्रसासन महाशाखा'],
                },
                {
                    id: 5642, sn: 17, regNo: 4983,
                    senderOfficeName: 'नेपाल सरकार संघिय मामिला तथा सामान्य प्रशासन मन्त्रालय',
                    subject: 'SEDP मा मनोनयन गरी पठाइएको',
                    letterKind: ['राजस्व शाखा'], senderOfficeAddress: 'बबरमहल,काठमाडौँ ',
                    isCorrect: true, remarks: 'सबै ठिक छ', letterRegNo: '२०७७/१२/०१/००६४', noOfLetter: 2185,
                    branchIds: ['प्रसासन योजना महाशाखा'],
                },
                {
                    id: 1235331, sn: 18, regNo: 4983,
                    senderOfficeName: 'नेपाल सरकार संघिय मामिला तथा सामान्य प्रशासन मन्त्रालय',
                    subject: 'SEDP मा मनोनयन गरी पठाइएको',
                    letterKind: ['राजस्व शाखा'], senderOfficeAddress: 'बबरमहल,काठमाडौँ ',
                    isCorrect: true, remarks: 'सबै ठिक छ', letterRegNo: '२०७७/१२/०१/००६४', noOfLetter: 2185,
                    branchIds: ['काठमाडौँ'],
                },
                {
                    id: 1235201, sn: 19, regNo: 4983,
                    senderOfficeName: 'नेपाल सरकार संघिय मामिला तथा सामान्य प्रशासन मन्त्रालय',
                    subject: 'SEDP मा मनोनयन गरी पठाइएको',
                    letterKind: ['राजस्व शाखा'], senderOfficeAddress: 'बबरमहल,काठमाडौँ ',
                    isCorrect: true, remarks: 'सबै ठिक छ', letterRegNo: '२०७७/१२/०१/००६४', noOfLetter: 2185,
                    branchIds: ['प्रसासन योजना महाशाखा'],
                },
                {
                    id: 1236351, sn: 20, regNo: 4983,
                    senderOfficeName: 'नेपाल सरकार संघिय मामिला तथा सामान्य प्रशासन मन्त्रालय',
                    subject: 'SEDP मा मनोनयन गरी पठाइएको',
                    letterKind: ['राजस्व शाखा'], senderOfficeAddress: 'बबरमहल,काठमाडौँ ',
                    isCorrect: true, remarks: 'सबै ठिक छ', letterRegNo: '२०७७/१२/०१/००६४', noOfLetter: 2185,
                    branchIds: ['काठमाडौँ'],
                },
                {
                    id: 1235351, sn: 21, regNo: 4983,
                    senderOfficeName: 'नेपाल सरकार संघिय मामिला तथा सामान्य प्रशासन मन्त्रालय',
                    subject: 'SEDP मा मनोनयन गरी पठाइएको',
                    letterKind: ['राजस्व शाखा'], senderOfficeAddress: 'बबरमहल,काठमाडौँ ',
                    isCorrect: true, remarks: 'सबै ठिक छ', letterRegNo: '२०७७/१२/०१/००६४', noOfLetter: 2185,
                    branchIds: ['प्रसासन योजना महाशाखा'],
                }
            ]));
        } else if (data === null) {
            localStorage.setItem('darta', JSON.stringify([
                {
                    id: 102, sn: 1, regNo: 348,
                    senderOfficeName: 'नेपाल सरकार संघिय मामिला तथा सामान्य प्रशासन मन्त्रालय', subject: 'विवरण उपलब्ध गराईदिने बारे',
                    letterKind: ['प्रशासन शाखा'], senderOfficeAddress: 'काठमाडौँ नेपाल',
                    isCorrect: true, remarks: 'सबै ठिक छ', letterRegNo: '२०७७/१२/०१/००५४', noOfLetter: 2154,
                    branchIds: ['काठमाडौँ'],
                },
                {
                    id: 981, sn: 2, regNo: 2363,
                    senderOfficeName: 'नेपाल सरकार संघिय मामिला तथा सामान्य प्रशासन मन्त्रालय',
                    subject: 'आयोजना/कार्यक्रम माग/प्रस्ताव पेश गर्ने सम्बन्धी सूचना',
                    letterKind: ['प्राबिधिक शाखा'], senderOfficeAddress: 'सिंहदरबार, काठमाडौँ',
                    isCorrect: true, remarks: 'सबै ठिक छ', letterRegNo: '२०७७/१२/०१/००५५', noOfLetter: 2156,
                    branchIds: ['कन्द्रिय समन्वय इकाई'],
                },
                {
                    id: 231, sn: 3, regNo: 3125,
                    senderOfficeName: 'शिक्षा तथा मानब स्रोत विकास केन्द्र',
                    subject: 'शिक्षक तलब भत्ता सम्बन्धमा',
                    letterKind: ['प्राबिधिक शाखा'], senderOfficeAddress: 'सानो ठिमी,भक्तपुर',
                    isCorrect: true, remarks: 'सबै ठिक छ', letterRegNo: '२०७७/१२/०१/००५६', noOfLetter: 2163,
                    branchIds: ['काठमाडौँ'],
                },
                {
                    id: 231, sn: 4, regNo: 1235,
                    senderOfficeName: 'नेपाल सरकार संघिय मामिला तथा सामान्य प्रशासन मन्त्रालय',
                    subject: 'पुन: ताकेता सम्बन्धमा', letterKind: ['आर्थिक प्रशासन शाखा'], senderOfficeAddress: 'सिंहदरबार,काठमाडौँ',
                    isCorrect: true, remarks: 'सबै ठिक छ', letterRegNo: '२०७७/१२/०१/००५७', noOfLetter: 2166,
                    branchIds: ['स्थानीय तह समन्वय शाखा'],
                },
                {
                    id: 522, sn: 5, regNo: 5675,
                    senderOfficeName: 'सस्कृति पर्यटन तथा नागरिक उड्डयन मन्त्रालय',
                    subject: 'स्थापित पर्यटकीय गन्तब्यको आवस्यक पुर्वधार विकास निर्माण कार्यक्रम सम्बन्धमा ',
                    letterKind: ['राजस्व शाखा'], senderOfficeAddress: 'सिंहदरबार,काठमाडौँ',
                    isCorrect: true, remarks: 'सबै ठिक छ', letterRegNo: '२०७७/१२/०१/००५८', noOfLetter: 2169,
                    branchIds: ['प्रसासन योजना महाशाखा'],
                },
                {
                    id: 243, sn: 6, regNo: 5685,
                    senderOfficeName: 'नेपाल सरकार संघिय मामिला तथा सामान्य प्रशासन मन्त्रालय',
                    subject: 'सुत्र लेखा प्रणाली लागु गर्ने सम्बन्धमा',
                    letterKind: ['राजस्व शाखा'], senderOfficeAddress: 'सिंहदरबार,काठमाडौँ',
                    isCorrect: true, remarks: 'सबै ठिक छ', letterRegNo: '२०७७/१२/०१/००५९', noOfLetter: 2171,
                    branchIds: ['आर्थिक प्रसासन महाशाखा'],
                },
                {
                    id: 765, sn: 7, regNo: 98725,
                    senderOfficeName: 'नेपाल सरकार संघिय मामिला तथा सामान्य प्रशासन मन्त्रालय',
                    subject: 'कन्सुलर प्रमाणीकरण सम्बन्धमा',
                    letterKind: ['राजस्व शाखा'], senderOfficeAddress: 'सिंहदरबार,काठमाडौँ',
                    isCorrect: true, remarks: 'सबै ठिक छ', letterRegNo: '२०७७/१२/०१/००६०', noOfLetter: 2175,
                    branchIds: ['स्थानीय तह समन्वय शाखा'],
                },
                {
                    id: 765, sn: 8, regNo: 98755,
                    senderOfficeName: 'नेपाल सरकार संघिय मामिला तथा सामान्य प्रशासन मन्त्रालय',
                    subject: 'कन्सुलर प्रमाणीकरण सम्बन्धमा',
                    letterKind: ['राजस्व शाखा'], senderOfficeAddress: 'सिंहदरबार,काठमाडौँ',
                    isCorrect: true, remarks: 'सबै ठिक छ', letterRegNo: '२०७७/१२/०१/००६१', noOfLetter: 2177,
                    branchIds: ['स्थानीय तह समन्वय शाखा'],
                },
                {
                    id: 2331, sn: 9, regNo: 9875,
                    senderOfficeName: 'नेपाल सरकार संघिय मामिला तथा सामान्य प्रशासन मन्त्रालय',
                    subject: 'कार्यमुलक लेखा परिक्षण सम्बन्धमा',
                    letterKind: ['प्राबिधिक शाखा'], senderOfficeAddress: 'सिंहदरबार,काठमाडौँ',
                    isCorrect: true, remarks: 'सबै ठिक छ', letterRegNo: '२०७७/१२/०१/००६२', noOfLetter: 2179,
                    branchIds: ['आर्थिक प्रसासन महाशाखा'],
                },
                {
                    id: 4531, sn: 10, regNo: 12334,
                    senderOfficeName: 'महालेखा परिक्षकको कार्यालय ',
                    subject: 'कार्यमुलक लेखा परिक्षण सम्बन्धमा',
                    letterKind: ['प्राबिधिक शाखा'], senderOfficeAddress: 'बबरमहल,काठमाडौँ ',
                    isCorrect: true, remarks: 'सबै ठिक छ', letterRegNo: '२०७७/१२/०१/००६३', noOfLetter: 2181,
                    branchIds: ['आर्थिक प्रसासन महाशाखा'],
                },
                {
                    id: 12351, sn: 11, regNo: 4983,
                    senderOfficeName: 'नेपाल सरकार संघिय मामिला तथा सामान्य प्रशासन मन्त्रालय',
                    subject: 'SEDP मा मनोनयन गरी पठाइएको',
                    letterKind: ['राजस्व शाखा'], senderOfficeAddress: 'बबरमहल,काठमाडौँ ',
                    isCorrect: true, remarks: 'सबै ठिक छ', letterRegNo: '२०७७/१२/०१/००६४', noOfLetter: 2185,
                    branchIds: ['काठमाडौँ'],
                },
                {
                    id: 123751, sn: 12, regNo: 4983,
                    senderOfficeName: 'नेपाल सरकार संघिय मामिला तथा सामान्य प्रशासन मन्त्रालय',
                    subject: 'SEDP मा मनोनयन गरी पठाइएको',
                    letterKind: ['राजस्व शाखा'], senderOfficeAddress: 'बबरमहल,काठमाडौँ ',
                    isCorrect: true, remarks: 'सबै ठिक छ', letterRegNo: '२०७७/१२/०१/००६४', noOfLetter: 2185,
                    branchIds: ['आर्थिक प्रसासन महाशाखा'],
                },
                {
                    id: 123951, sn: 13, regNo: 4983,
                    senderOfficeName: 'नेपाल सरकार संघिय मामिला तथा सामान्य प्रशासन मन्त्रालय',
                    subject: 'SEDP मा मनोनयन गरी पठाइएको',
                    letterKind: ['राजस्व शाखा'], senderOfficeAddress: 'बबरमहल,काठमाडौँ ',
                    isCorrect: true, remarks: 'सबै ठिक छ', letterRegNo: '२०७७/१२/०१/००६४', noOfLetter: 2185,
                    branchIds: ['काठमाडौँ'],
                },
                {
                    id: 123501, sn: 14, regNo: 4983,
                    senderOfficeName: 'नेपाल सरकार संघिय मामिला तथा सामान्य प्रशासन मन्त्रालय',
                    subject: 'SEDP मा मनोनयन गरी पठाइएको',
                    letterKind: ['राजस्व शाखा'], senderOfficeAddress: 'बबरमहल,काठमाडौँ ',
                    isCorrect: true, remarks: 'सबै ठिक छ', letterRegNo: '२०७७/१२/०१/००६४', noOfLetter: 2185,
                    branchIds: ['काठमाडौँ'],
                },
                {
                    id: 121351, sn: 15, regNo: 4983,
                    senderOfficeName: 'नेपाल सरकार संघिय मामिला तथा सामान्य प्रशासन मन्त्रालय',
                    subject: 'SEDP मा मनोनयन गरी पठाइएको',
                    letterKind: ['राजस्व शाखा'], senderOfficeAddress: 'बबरमहल,काठमाडौँ ',
                    isCorrect: true, remarks: 'सबै ठिक छ', letterRegNo: '२०७७/१२/०१/००६४', noOfLetter: 2185,
                    branchIds: ['आर्थिक प्रसासन महाशाखा'],
                },
                {
                    id: 126351, sn: 16, regNo: 4983,
                    senderOfficeName: 'नेपाल सरकार संघिय मामिला तथा सामान्य प्रशासन मन्त्रालय',
                    subject: 'SEDP मा मनोनयन गरी पठाइएको',
                    letterKind: ['राजस्व शाखा'], senderOfficeAddress: 'बबरमहल,काठमाडौँ ',
                    isCorrect: true, remarks: 'सबै ठिक छ', letterRegNo: '२०७७/१२/०१/००६४', noOfLetter: 2185,
                    branchIds: ['आर्थिक प्रसासन महाशाखा'],
                },
                {
                    id: 5642, sn: 17, regNo: 4983,
                    senderOfficeName: 'नेपाल सरकार संघिय मामिला तथा सामान्य प्रशासन मन्त्रालय',
                    subject: 'SEDP मा मनोनयन गरी पठाइएको',
                    letterKind: ['राजस्व शाखा'], senderOfficeAddress: 'बबरमहल,काठमाडौँ ',
                    isCorrect: true, remarks: 'सबै ठिक छ', letterRegNo: '२०७७/१२/०१/००६४', noOfLetter: 2185,
                    branchIds: ['प्रसासन योजना महाशाखा'],
                },
                {
                    id: 1235331, sn: 18, regNo: 4983,
                    senderOfficeName: 'नेपाल सरकार संघिय मामिला तथा सामान्य प्रशासन मन्त्रालय',
                    subject: 'SEDP मा मनोनयन गरी पठाइएको',
                    letterKind: ['राजस्व शाखा'], senderOfficeAddress: 'बबरमहल,काठमाडौँ ',
                    isCorrect: true, remarks: 'सबै ठिक छ', letterRegNo: '२०७७/१२/०१/००६४', noOfLetter: 2185,
                    branchIds: ['काठमाडौँ'],
                },
                {
                    id: 1235201, sn: 19, regNo: 4983,
                    senderOfficeName: 'नेपाल सरकार संघिय मामिला तथा सामान्य प्रशासन मन्त्रालय',
                    subject: 'SEDP मा मनोनयन गरी पठाइएको',
                    letterKind: ['राजस्व शाखा'], senderOfficeAddress: 'बबरमहल,काठमाडौँ ',
                    isCorrect: true, remarks: 'सबै ठिक छ', letterRegNo: '२०७७/१२/०१/००६४', noOfLetter: 2185,
                    branchIds: ['प्रसासन योजना महाशाखा'],
                },
                {
                    id: 1236351, sn: 20, regNo: 4983,
                    senderOfficeName: 'नेपाल सरकार संघिय मामिला तथा सामान्य प्रशासन मन्त्रालय',
                    subject: 'SEDP मा मनोनयन गरी पठाइएको',
                    letterKind: ['राजस्व शाखा'], senderOfficeAddress: 'बबरमहल,काठमाडौँ ',
                    isCorrect: true, remarks: 'सबै ठिक छ', letterRegNo: '२०७७/१२/०१/००६४', noOfLetter: 2185,
                    branchIds: ['काठमाडौँ'],
                },
                {
                    id: 1235351, sn: 21, regNo: 4983,
                    senderOfficeName: 'नेपाल सरकार संघिय मामिला तथा सामान्य प्रशासन मन्त्रालय',
                    subject: 'SEDP मा मनोनयन गरी पठाइएको',
                    letterKind: ['राजस्व शाखा'], senderOfficeAddress: 'बबरमहल,काठमाडौँ ',
                    isCorrect: true, remarks: 'सबै ठिक छ', letterRegNo: '२०७७/१२/०१/००६४', noOfLetter: 2185,
                    branchIds: ['प्रसासन योजना महाशाखा'],
                }
            ]));
        }
    }

    getDarta<T extends ResponseModel>(params?: QueryModel): Observable<T> {
        const p = this.paramGen.createParams(params);
        return this.http.get<T>(`${this.api}/Get`, { params: p });
    }

    getDartaById<T extends ResponseModel>(id: number): Observable<T> {
        return this.http.get<T>(`${this.api}/Get/${id}`);
    }

    addOrUpdate<T extends ResponseModel>(body: any): Observable<T> {

        return body.id > 0
            ? this.http.put<T>(`${this.api}/Update`, body)
            : this.http.post<T>(`${this.api}/Create`, body);
    }

    deleteDarta<T extends ResponseModel>(id: number): Observable<T> {
        return this.http.delete<T>(`${this.api}/Delete/${id}`);
    }

    getList(): Observable<any> {
        const data = JSON.parse(localStorage.getItem('darta'));
        if (data !== null) {
            return of(data);
        } else {
            return of([]);
        }
    }

    getListById(id: number): Observable<any> {
        const d = JSON.parse(localStorage.getItem('darta'));
        if (d !== null) {
            const e = d.find(_ => _.id === id);
            return of(e);
        } else {
            localStorage.setItem('darta', JSON.stringify([]));
            const data = JSON.parse(localStorage.getItem('darta'));
            const e = data.find(_ => _.id === id);
            return of(e);
        }
    }

    delete(id: number): Observable<any> {
        const data = JSON.parse(localStorage.getItem('darta'));
        if (data !== null) {
            const i = data.findIndex(_ => _.id === id);
            data.splice(i, 1);
            localStorage.setItem('darta', JSON.stringify(data));
            return of(data);
        } else {
            localStorage.setItem('darta', JSON.stringify([]));
            const d = JSON.parse(localStorage.getItem('darta'));
            const i = d.findIndex(_ => _.id === id);
            d.splice(i, 1);
            localStorage.setItem('darta', JSON.stringify(data));
            return of(d);
        }
    }

    update(body: any): Observable<any> {
        const d = JSON.parse(localStorage.getItem('darta'));
        if (d !== null) {
            const eValue = d.findIndex(x => x.id === body.id);
            body.sn = d[eValue].sn;
            d[eValue] = body;
            localStorage.setItem('darta', JSON.stringify(d));
            return of(body);
        } else {
            localStorage.setItem('darta', JSON.stringify([]));
            const data = JSON.parse(localStorage.getItem('darta'));
            const eValue = data.findIndex(x => x.id === body.id);
            data[eValue] = body;
            localStorage.setItem('darta', JSON.stringify(data));
            return of(body);
        }
    }

    add(body: any): Observable<any> {
        const data = JSON.parse(localStorage.getItem('darta'));
        if (data !== null) {
            data.push(body);
            body.id = data.length + 1;
            body.sn = data.length + 1;
            localStorage.setItem('darta', JSON.stringify(data));
            return of(body);
        } else {
            localStorage.setItem('darta', JSON.stringify([]));
            const d = JSON.parse(localStorage.getItem('darta'));
            d.push(body);
            body.id = d.length + 1;
            body.sn = d.length + 1;
            localStorage.setItem('darta', JSON.stringify(d));
            return of(body);
        }
    }
}



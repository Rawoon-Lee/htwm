package a306.htwm.service;

import a306.htwm.dto.RecordRoutineDTO;
import a306.htwm.entity.Record;
import a306.htwm.repository.RecordRepository;
import a306.htwm.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.Period;
import java.util.ArrayList;

@Service
@Transactional(readOnly = true) // 기본은 false
@RequiredArgsConstructor
public class RecordService {

    public final RecordRepository recordRepository;
    public final UserRepository userRepository;

    @Transactional
    public void join(RecordRoutineDTO recordRoutineDTO) {

        if(userRepository.findByUsername(recordRoutineDTO.getUsername())==null){
            throw new RuntimeException("no username");
        }

        Record record = new Record();
        record.setStartDatetime(recordRoutineDTO.getStartDateTime());
        record.setEndDatetime(recordRoutineDTO.getEndDateTime());
        record.setDoneSetNum(recordRoutineDTO.getDoneSetNum());
        record.setRoutineString(recordRoutineDTO.getRoutineJson());
        record.setUser(userRepository.findByUsername(recordRoutineDTO.getUsername()));
        recordRepository.save(record);
    }

    public ArrayList<RecordRoutineDTO> getRoutine(String username) {
        Long userId = userRepository.findByUsername(username).getId();
        ArrayList<Record> records = recordRepository.findAllByUserId(userId);
        ArrayList<RecordRoutineDTO> recordRoutineDTOS=new ArrayList<>();
        for(Record record : records){
            RecordRoutineDTO recordRoutineDTO = RecordRoutineDTO.builder()
                    .username(username)
                    .StartDateTime(record.getStartDatetime())
                    .EndDateTime(record.getEndDatetime())
                    .doneSetNum(record.getDoneSetNum())
                    .routineJson(record.getRoutineString())
                    .build();
            recordRoutineDTOS.add(recordRoutineDTO);
        }
        return recordRoutineDTOS;
    }

    public Integer count(String username, String date) {
        if(userRepository.findByUsername(username)== null) throw new RuntimeException("no such username");
        ArrayList<String> dates = recordRepository.getDates(userRepository.findByUsername(username).getId());

        boolean start = false;
        LocalDate bef = LocalDate.now();
        LocalDate startDate = LocalDate.parse(date);
        LocalDate endDate = startDate;

        for(String day : dates){
//            String date = onedate.getDate();
            LocalDate ymd = LocalDate.parse(day);
            if(!start){
                if(day.equals(date)) start = true;
                bef = ymd;
            }else{
                if(bef.minusDays(1).equals(ymd)) {
                    bef = ymd;
                    endDate = bef;
                    continue;
                }
                else {
                    break;
                }
            }
        }
        if(!start) return 0;
        Period period = Period.between(endDate,startDate);
        return period.getDays() + 1;
    }
}
